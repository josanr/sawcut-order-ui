/**
 * Created by ruslan on 14.08.2017.
 */

'use strict';


Core.prototype.load = function(actType, link, postData, noshow){

    let type = null;
    let self = this;
    switch (actType) {
        case 'post':
            type = 'POST';
            break;
        case 'get':
            type = 'GET';
            break;
        case 'put':
            type = 'PUT';
            break;
        case 'delete':
        case 'del':
            type = 'DELETE';
            break;
    }

    if (!type) {
        throw new Error('Type of action is null');
    }

    if (noshow === undefined) {
        Core.Wait('show');
    }

    try {
        let jsp = new window.Promise(function (resolve, reject) {
            $.ajax({
                url: link,
                method: type,
                data: postData,
                dataType: 'text',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + self.jwt);
                },
            }).done(resolve).fail(reject)
        })
            .then(JSON.parse)
            .then(function (data) {
                Core.Wait('hide');
                if (data.error) {
                    throw new Error(data.error);
                }

                return data;
            })
            .catch(function (err) {
                Core.Wait('hide');
                Core.Alert(err.responseText || err.message);
                console.log(err);
                throw new Error(err.responseText || err.message);
            });
        return jsp;
    }catch (ex){

        return null;
    }
};