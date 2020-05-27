import constants from "../config/constants";
import * as DateUtils from "./DateUtils";

let COS = require('../utils/cos-react-native-sdk-v5.js');
export function init() {
    this.cos = new COS({
        getAuthorization: function (options, callback) {
            console.log("initCos~2")
            let body = "Method=" + options.Method + "&Key=" + options.Key
            fetch(constants.host + constants.workspace + 'api/txcos/sts.php', {
                method: 'GET',
                // mode: "cors",
                // headers: {
                //     'Accept': '*/*',
                //     'Access-Control-Allow-Origin':'*',
                //     'Content-Type': 'application/json',
                // },
            }).then((response) => response.json()).then(
                (responseJson) => {
                    // alert(JSON.stringify(responseJson))
                    let data = responseJson.data
                    callback({
                        TmpSecretId: data.credentials && data.credentials.tmpSecretId,
                        TmpSecretKey: data.credentials && data.credentials.tmpSecretKey,
                        XCosSecurityToken: data.credentials && data.credentials.sessionToken,
                        ExpiredTime: data.expiredTime,
                    });
                })
                .catch((error) => {
                    alert(error);
                });
        }
    });
}

export function uploadFile(that, result, type) {
    let key = 'app/sign/' + DateUtils.dateFormat(new Date().getTime(), 'yyyyMMdd') + "/sign_" + new Date().getTime() + ('image' === type ? '.jpeg' : '.mp4')
    this.cos.postObject({
        Bucket: constants.Bucket,
        Region: constants.Region,
        Key: key,
        FilePath: result,
        onProgress: function (info) {
            // console.log("uploadImg" + JSON.stringify(info));
        }
    }, function (err, data) {
        if (data) {

        }
        // alert(err || data);
        // console.log(err || data);
    });
}