"use strict";
function Core(jwt) {

    this.jwt = window.jwt || jwt || "";
    this.filial = 1;
    try {
        if (process !== undefined
            && process.mainModule.exports.config !== undefined
            && process.mainModule.exports.config.filial != undefined) {
            this.filial = process.mainModule.exports.config.filial;
        }
    }catch (e) {

    }
}

Core.jwtStoreIndex = "JWT";

Core.prototype.Alert = function (body, head) {
    var al = $('#alert-modal');
    if (head != undefined) {
        al.find('.modal-header h3').html(head);
    }
    if (body != undefined) {
        al.find('.modal-body p').html(body);
    }
    al.on('shown', function () {
        $('#closeAlertModal').focus();
    });
    al.modal('show');
};

Core.Alert = function (body, head) {
    var al = $('#alert-modal');
    if (head != undefined) {
        al.find('.modal-header h3').html(head);
    }
    if (body != undefined) {
        al.find('.modal-body p').html(body);
    }
    al.on('shown', function () {
        $('#closeAlertModal').focus();
    });
    al.modal('show');
};


Core.prototype.Wait = function (action) {

    if (action == 'show') {
        $('#loading').css({
            'top': $(window).height() / 2 - 64 + 'px',
            'left': $(window).width() / 2 - 64 + 'px'
        })
            .show();
        $('#grey').css({
            'height': $(document).height() + 'px',
            'width': $(document).width() + 'px'
        })
            .show();

    } else if (action == 'hide') {
        $('#grey').hide();
        $('#loading').hide();
    }
};


Core.Wait = function (action) {

    if (action == 'show') {
        $('#loading').css({
            'top': $(window).height() / 2 - 64 + 'px',
            'left': $(window).width() / 2 - 64 + 'px'
        })
            .show();
        $('#grey').css({
            'height': $(document).height() + 'px',
            'width': $(document).width() + 'px'
        })
            .show();
        $("#page-dimmer").addClass('active');
    } else if (action == 'hide') {
        $('#grey').hide();
        $('#loading').hide();
        $("#page-dimmer").removeClass('active');
    }
};

Core.handleFail = function (xhr, t, e) {

    if(xhr.status === 401){
        let base = window.location.pathname.split("/")[0];
        if(base === "production"){
            window.location.href = "/production/login/login";
        }else{
            window.location.href = "/site/login";
        }
    }else{
        Core.Wait('hide');
        Core.Alert(xhr.responseText);
        return false;
    }

};


Core.prototype.post = function (link, postData, result, noshow) {

    this.act('post', link, postData, result, noshow);
};


Core.prototype.get = function (link, postData, result, noshow) {

    this.act('get', link, postData, result, noshow);
};

Core.prototype.put = function (link, postData, result, noshow) {

    this.act('put', link, postData, result, noshow);
};


Core.prototype.del = function (link, postData, result, noshow) {

    this.act('del', link, postData, result, noshow);

};

Core.prototype.getHtml = function (link, postData, result, noshow) {

    if (noshow == undefined) {
        Core.Wait('show');
    }
    $.ajax({
        url: link,
        method: 'GET',
        //success: result,
        data: postData,
        dataType: 'text',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + self.jwt);
        },
    })
        .fail(Core.handleFail)
        .done(function (msg) {
            Core.Wait('hide');
            result(msg);
        });

};


Core.prototype.act = function (actType, link, postData, result, noshow) {
    var type = null;
    var self = this;
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

    if (noshow == undefined) {
        Core.Wait('show');
    }
    $.ajax({
        url: link,
        method: type,
        data: postData,
        dataType: 'text',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + self.jwt);
        },
    })
        .fail(Core.handleFail)
        .done(function (msg) {
            try {
                var data = JSON.parse(msg);

            } catch (e) {
                Core.Wait('hide');
                Core.Alert('JSON parse error: ' + e.message);
                return false;
            }
            if (data.error) {
                Core.Wait('hide');
                Core.Alert(data.error);
                return false;
            }
            Core.Wait('hide');
            result(data);
        });




};

Core.newDiv = function(){
    return document.createElement("div");
};

Core.newBtn = function (text) {
    var frag = document.createElement("button");
    frag.className = "btn";
    frag.innerHTML = text;
    frag.style.textOverflow = "ellipsis";
    frag.style.overflow = "hidden";
    return frag;
};

Core.newInp = function(){
    var frag = document.createElement("input");
    frag.type = "text";
    return frag;
};

Core.newDate = function(){
    var frag = document.createElement("input");
    frag.type = "date";
    return frag;
};

Core.createTable = function () {
    var frag = document.createElement("table");
    frag.className = "table table-bordered table-striped";

    var head = document.createElement("thead");
    var body = document.createElement("tbody");

    frag.appendChild(head);
    frag.appendChild(body);

    return {
        table: frag,
        head: head,
        body: body
    };
};

Core.createMod = function(){
    var modal = document.createElement("div");
    modal.className = "modal hide";

    var headerHolder = document.createElement("div");
    headerHolder.className = "modal-header";
    headerHolder.innerHTML = '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';

    var header = document.createElement("h3");

    var bodyHolder = document.createElement("div");
    bodyHolder.className = "modal-body";

    var footerHolder = document.createElement("div");
    footerHolder.className = "modal-footer";

    var dissmis = document.createElement("a");
    dissmis.href = "#";
    dissmis.dataset.dismiss = "modal";
    dissmis.className = "btn pull-left";
    dissmis.innerHTML = "Отмена";

    var save = document.createElement("a");
    save.href = "#";
    save.className = "btn btn-primary";
    save.innerHTML = "Сохранить";

    headerHolder.appendChild(header);
    footerHolder.appendChild(dissmis);
    footerHolder.appendChild(save);

    modal.appendChild(headerHolder);
    modal.appendChild(bodyHolder);
    modal.appendChild(footerHolder);


    return {
        modal: modal,
        headerHolder: headerHolder,
        header: header,
        bodyHolder: bodyHolder,
        footerHolder: footerHolder,
        dissmis: dissmis,
        save: save,
        show: function(){
            $(modal).modal("show");
        },
        hide: function(){
            $(modal).modal("hide");
        }
    }

};

