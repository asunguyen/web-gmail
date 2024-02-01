const User = require("../models/user");
const Thueso = require("../models/thueso");
const Payment = require("../models/payment");
const ThuesoBackup = require("../models/backupThuesoModel");
let listCodeID = [];
const job = {
    autojob: async (un) => {
        try {
            let username = un;
            const user = await User.findOne({ username: username });
            console.log("user auto job:: ", user);
            if (user.rqOk >= 0 && user.rqExp >= 0 && user.amountExp >= 0 && user.amountOk >= 0) {
                const listRequestPhone = await Thueso.find({ userID: user._id });
                let infoThueSo = {
                    totalRq: 0,
                    totalOtp: 0,
                    totalExp: 0,
                    totalPayRq: 0,
                    totalPayOtp: 0,
                    totalPayExp: 0
                };
                console.log("listRequestPhone:: " + listRequestPhone.length + " - time:: " + new Date());
                if (listRequestPhone && listRequestPhone.length > 0) {
                    listRequestPhone.find((x) => {
                        if (x.status == 0) {
                            infoThueSo.totalRq++;
                            infoThueSo.totalPayRq += x.amount ? x.amount : 0;
                        }
                        if (x.status == 1) {
                            infoThueSo.totalOtp++;
                            infoThueSo.totalPayOtp += x.amount ? x.amount : 0;
                        }
                        if (x.status == 3) {
                            infoThueSo.totalExp++;
                            infoThueSo.totalPayExp += x.amount ? x.amount : 0;
                        }
                    })

                }
                infoThueSo.totalOtp += user.rqOk;
                infoThueSo.totalPayOtp += user.amountOk;
                infoThueSo.totalExp += user.rqExp;
                infoThueSo.totalPayExp += user.amountExp;
                const listPaymentUser = await Payment.find({ userID: user._id, status: 1 });
                console.log("listPaymentUser::", listPaymentUser)
                let totalPayUser = {
                    tiennap: 0,
                    tienbonus: 0,
                    tongtien: 0
                }
                if (listPaymentUser && listPaymentUser.length > 0) {
                    listPaymentUser.find((x) => {
                        var cupon = x.cupon ? (x.amount * x.cupon / 100) : 0;
                        totalPayUser.tiennap += x.amount;
                        totalPayUser.tienbonus += x.cupon ? x.cupon : 0;

                    })
                    totalPayUser.tongtien = totalPayUser.tiennap + totalPayUser.tienbonus;
                }

                let soduvi = totalPayUser.tongtien * 1000 - infoThueSo.totalPayRq - infoThueSo.totalPayOtp;

                const userUD = await User.findByIdAndUpdate(user._id, { amount: soduvi });
                console.log("job auto backup: ", userUD);
                return { user: userUD, totalPayUser: totalPayUser, infoThueSo: infoThueSo, soduvi: soduvi };


            } else {
                if (user && user._id) {
                    //job.jobBackup(user._id);
                    return {user: user};
                } else {
                    console.log("khong co user");
                    return "";
                }

            }
        } catch (err) {
            console.log("lỗi hoàn tiền auto:: " + err);
            return "";
        }
    },
    updateAmountUser: async () => {
        try {
            let listThueSo = await Thueso.find({ status: 0 });
            if (listThueSo && listThueSo.length > 0) {
                for (var i = 0; i < listThueSo.length; i++) {

                    if ((new Date().getTime() - new Date(listThueSo[i].createdAt).getTime()) / 1000 > 200) {
                        await Thueso.findByIdAndUpdate(listThueSo[i]._id, { status: 3 });
                        var user = await User.findById(listThueSo[i].userID);
                        await job.autojob(user.username);
                        console.log("hoàn tiền thành công: " + user.username + " số dư ví: " + user.amount + " time:: " + new Date());
                    }
                }
            }
        } catch (err) {
            console.log("error updateAmountUser:: ", err);
        }

    },
    jobBackup: async (userID) => {
        try {
            const listSoUpdate = await Thueso.find({ userID: userID, status: { $ne: 0 } });
            console.log("listSoUpdate:: job Backup::: ", listSoUpdate);
            let totalRq = {
                rqExp: 0,
                rqOk: 0,
                amountExp: 0,
                amountOk: 0
            }
            if (listSoUpdate && listSoUpdate.length > 0) {
                for (var i = 0; i < listSoUpdate.length; i++) {
                    if (listSoUpdate[i].status == 1) {
                        totalRq.rqOk += 1;
                        totalRq.amountOk += listSoUpdate[i].amount;
                    } else {
                        totalRq.rqExp += 1;
                        totalRq.amountExp += listSoUpdate[i].amount;
                    }
                    // tao backbup
                    job.jobChangeBackupThueSo(listSoUpdate[i]);
                }
                const user = await User.findById(userID);
                if (user.rqOk && user.rqOk >= 0) {
                    totalRq.rqOk += user.rqOk;
                }
                if (user.amountOk && user.amountOk >= 0) {
                    totalRq.amountOk += user.amountOk;
                }
                if (user.rqExp && user.rqExp >= 0) {
                    totalRq.rqExp += user.rqExp;
                }
                if (user.amountExp && user.amountExp >= 0) {
                    totalRq.amountExp += user.amountExp;
                }
                const userUD = await User.findByIdAndUpdate(userID, { amountExp: totalRq.amountExp, rqExp: totalRq.rqExp, rqOk: totalRq.rqOk, amountOk: totalRq.amountOk })

            } else {
                console.log("listSoUpdate:: " + listSoUpdate + " time:: " + new Date());
            }
        } catch (err) {
            console.log("loi jobBackup: ", err);
        }
    },
    jobChangeBackupThueSo: async (listSoUpdate) => {
        try {
            const newThuesoBackup = await new ThuesoBackup({
                codeID: listSoUpdate.codeID,
                userID: listSoUpdate.userID,
                phoneNumber: listSoUpdate.phoneNumber,
                brand: listSoUpdate.brand,
                otp: listSoUpdate.otp,
                time: listSoUpdate.time,
                amount: listSoUpdate.amount,
                timeCreatePhone: listSoUpdate.timeCreatePhone,
                status: listSoUpdate.status
            });
            const thuesoBU = await newThuesoBackup.save();
            console.log("thuesoBU:: ", thuesoBU);
            await Thueso.findByIdAndDelete(listSoUpdate._id);
        } catch (err) {
            console.log("loi jobChangeBackupThueSo");
        }
    },
    getHistoryPhoneOtp: async () => {
        try {
            console.log("chạy vào đây")
            const page = 7;
            const listPhone = await ThuesoBackup.find({status: 3, brand: "Telegram"}).limit(5000).skip(page*5000);
            if (listPhone.length < 5000) {
                console.log("hết số")
            }
            let data = [];
            for(var i = 0; i < listPhone.length; i++) {
                if (!data.includes(listPhone[i].phoneNumber)) {
                    data.push(listPhone[i].phoneNumber);
                }
            }
            return data.toString();
        } catch (err) {
            console.log(err);
        }
    },
    jobUpdateHistory: async(userName) => { 
        try {   
            const user = await User.findOne({username: userName});
            if (user && user._id){
                let data = {
                    rqOk: 0,
                    rqExp: 0,
                    amountExp: 0,
                    amountOk: 0,
                }
                const listPhoneHistory = await ThuesoBackup.find({userID: user._id});
                for (var i = 0; i < listPhoneHistory.length; i++) {
                    if (listPhoneHistory[i].status == 3) {
                        data.rqExp++;
                        data.amountExp += listPhoneHistory[i].amount;
                    } else if (listPhoneHistory[i].status == 1){
                        data.rqOk++;
                        data.amountOk += listPhoneHistory[i].amount;
                    }
                }
                const userUD = await User.findByIdAndUpdate(user._id, {rqOk: data.rqOk, rqExp: data.rqExp, amountExp: data.amountExp, amountOk: data.amountOk});
                console.log("listPhoneHistory:: ", listPhoneHistory);
            } else {
                return {code: 404, error: "không tìm thấy user"};
            }
        }catch(err) {
            return {code: 500, error: err};
        }
    },
    thongKeDichVu: async(dichvu) => {
        try {
            const countExp = await ThuesoBackup.countDocuments({brand: dichvu, status: 3});
            const countOk = await ThuesoBackup.countDocuments({brand: dichvu, status: 1});
            let data = {
                countExp: countExp,
                countOk: countOk,
            };
            return {code: 200, data: data};
        }catch(err) {
            return {code: 500, error: err};
        }
    },
    updateDB: async(page) => {
        try {
            let pagesize = page;
            console.log("page:: ", pagesize);
            const listPhone = await ThuesoBackup.find().limit(100).skip(pagesize * 100);
            if (listPhone && listPhone.length > 0) {
                console.log("chạy vô đây");
                for(var i = 0; i < listPhone.length; i++) {
                    if (!listCodeID.includes(listPhone[i].codeID)) {
                        listCodeID.push(listPhone[i].codeID);
                    } else {
                        console.log("xóa:: "+ listPhone[i].codeID);
                        await ThuesoBackup.findOneAndDelete({codeID: listPhone[i].codeID});
                    }
                    if (i == listPhone.length - 1) {
                        if (listPhone.length == 100) {
                            pagesize++;
                            job.updateDB(pagesize);
                        } else {
                            console.log("chạy xong rồi");
                        }
                    }
                }
                
            } else {
                console.log("chạy xong");
            }
            
        }catch(err) {
            console.log("updateDB:: ", err);
        }
    },
    updateUserHistStatus: async(username, pagesize) => {
        try {
            let page = pagesize;
            const user = await User.findOne({username: username});
            console.log("user:: ", user);
            if (user && user._id) {
                const listPhone = await ThuesoBackup.find({userID: user._id, status: 3}).limit(30).skip(30*page);
                if (listPhone && listPhone.length > 0) {
                    for(var i = 0; i < listPhone.length; i++) {
                        user.amount = user.amount - listPhone[i].amount;
                        user.amountExp = user.amountExp - listPhone[i].amount;
                        user.amountOk = user.amountOk + listPhone[i].amount;
                        user.rqExp = user.rqExp - 1;
                        user.rqOk = user.rqOk + 1;
                        const userUD = await User.findByIdAndUpdate(user._id, {amount: user.amount, amountExp: user.amountExp, amountOk: user.amountOk, rqExp: user.rqExp, rqOk: user.rqOk});
                        const randomOtp = Math.floor((Math.random() * 1000000));
                        const thuesoUD = await ThuesoBackup.findByIdAndUpdate(listPhone[i]._id, {status: 1, otp: randomOtp});
                        console.log("userUD:: ", userUD);
                        if (i == listPhone.length - 1) {
                            console.log("change page");
                            if (listPhone.length >= 30) {
                                page++;
                                job.updateUserHistStatus(username, page);
                            } else {
                                console.log("chạy xong");
                                return;
                            }
                            
                        }
                    }
                    
                } else {
                    console.log("chạy xong");
                    return;
                }
            } else {
                console.log("không tìm thấy user");
                return;
            }
        }catch(err) {
            console.log("lỗi updateUserHistStatus:: ", err);
        }
    }
};

module.exports = job;