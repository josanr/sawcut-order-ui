"use strict";

const order = {};

order.order_id = 0;
order.orderName = "WebOrder";
order.order_type = 1;
order.abs = [];
order.materials = [];
order.absData = {};
order.panels = {};
order.info = {
    "poliuretan": false,
    "drillProgramm": true

};

const c = new Core();


let addAbsList = function (obj) {
    const absItem = $('#absList option[value="' + obj.goods_id + '"]');
    if (absItem.length === 0) {

        $('#absList')
            .append($("<option></option>")
                .attr("value", obj.goods_id)
                .attr("data-short", obj.shortName)
                .attr("data-thick", obj.thick)
                .attr("data-width", obj.width)
                .text(obj.name));
    } else {
        absItem.prop('selected', true);
    }
};

let exchangeMat = function (obj) {
    let oldId = $('#oldmat').val();
    if ($('#materialList #tab-' + obj.goods_id).length !== 0) {
        $('#materialchangemodal').modal('hide');
        Core.Alert('Такой материал уже есть!');
    } else {

        let table = $('#' + oldId + ' table tbody').clone(true).replaceAll($('#' + oldId + ' table tbody'));
        addMaterialList(obj, 'x');
        let newTable = $('#' + obj.goods_id + ' table tbody');
        newTable.replaceWith(table);
        removeMaterialList(' ', oldId);
        atachTableEvents(obj.goods_id);
        $('#materialchangemodal').modal('hide');
    }
};

let removeAbsList = function () {
    let selected = $('#absList option:selected').val();
    if (selected === undefined || selected == '#') {
        return;
    }

    $('#absList option[value="' + selected + '"]').remove();

    $('#workArea .select').each(function (index) {
        if ($(this).data('absid') == selected) {
            $(this).val('').attr('data-absid', '');
        }
    });

};

let removeMaterialList = function (event, objid) {
    let selected;
    if (objid === undefined) {
        selected = event.target.dataset.id;
    } else {
        selected = objid;
    }

    $('#materialList li#tab-' + selected).remove();
    $('#workArea #' + selected).remove();

    $('#materialList li').first().children('a').first().click();

};

let addMaterialList = function (obj, init) {
    if (init === undefined) {
        autoSave();
    }

    if ($('#materialList #tab-' + obj.goods_id).length !== 0) {
        $('#materialList a[href="#' + obj.goods_id + '"]').tab('show');
    } else {

        $('#materialList').append(
            $('<li id="tab-' + obj.goods_id + '" style="background-color: #F5F5F5;"></li>')
                .attr('data-length', obj.length)
                .attr('data-width', obj.width)
                .attr('data-thick', obj.thick)
                .attr('data-type', obj.goods_type)
                .html(
                    '<a href="#' + obj.goods_id + '" data-toggle="tab">' +
                    '<button class="close" type="button" id="remove-' + obj.goods_id + '" data-id="' + obj.goods_id + '" >×</button><span class="name">' +
                    obj.name +
                    '</span></a>'
                )
        );

        $('#workArea').append(createWorkTable(obj));
        $('#materialList a[href="#' + obj.goods_id + '"]').tab('show');
        atachTableEvents(obj.goods_id);
    }
};

let autos = 0;
let autoSave = function () {
    autos = 1;
    const result = collectInputData();
    autos = 0;
    window.localStorage.setItem("ORDER", result);

};

let createWorkTable = function (obj) {
    let specId = obj.id || 0;
    let html = '<div id="' + obj.goods_id + '" class="tab-pane" data-specid="' + specId + '">';
    // html += '		<button id="importtext-' + obj.goods_id + '" class="btn btn-success span1" style="margin:0 15px">Excel</button>';
    html += '		<div class="row-fluid"><button id="editMat-' + obj.goods_id + '" class="btn span2" style="margin:0 15px 15px 15px">Изменить материал</button></div>';
    html += '		';
    let disp = '';
    if ([2, 11, 21].indexOf(+order.order_type) < 0) {
        disp = 'display:none';
    }
    html += '		<label class="span2" style="line-height: 30px; ' + disp + '"><input type="checkbox" id="clientMat-' + obj.goods_id + '">Мат. клиента</label>';
    html += '		<label class="span2" style="line-height: 30px; ' + disp + '"><input type="checkbox" id="onlyAbs-' + obj.goods_id + '" disabled="disabled">Только поклейка</label>';

    html += '	<table class="simple-table">';
    html += '			<thead>';
    html += '				<tr>';
    html += '				<th>№</th>';
    html += '				<th>Длинна</th>';
    html += '				<th>Ширина</th>';
    html += '				<th>Кол.</th>';
    html += '				<th>L1</th>';
    html += '				<th>L2</th>';
    html += '				<th>W1</th>';
    html += '				<th>W2</th>';
    // html += '				<th>Ор.</th>';
    html += '				<th>Чпу</th>';
    html += '				<th>Склейка</th>';
    html += '				<th>Паз</th>';
    html += '				<th>Присадка</th>';
    html += '				<th>Угол</th>';
    html += '				<th>Упил</th>';
    html += '				<th>Комментарий</th>';
    html += '				<th>Удалить</th>';
    html += '				</tr>';
    html += '			</thead>';
    html += '				<tbody>';
    html += createWorkLine(1);
    html += '				</tbody>';
    html += '		</table><br />';
    html += '</div>';
    return html;
};

let createWorkLine = function (pos) {
    let html = '						<tr class="line-' + pos + '" data-paramid="0" data-pos="' + pos + '" data-modelindex="0">';
    html += '							<td class="pos" >' + pos + '</td>';
    html += '							<td class="length"><input type="text" class="simpleinput" style="width:60px" /></td>';
    html += '							<td class="width"><input type="text" class="simpleinput" style="width:60px" /></td>';
    html += '							<td class="num"><input type="text" class="simpleinput" style="width:60px" /></td>';
    html += '							<td class="l1"><input type="text" class="simpleinput select" style="width:140px" /></td>';
    html += '							<td class="l2"><input type="text" class="simpleinput select" style="width:140px" /></td>';
    html += '							<td class="w1"><input type="text" class="simpleinput select" style="width:140px" /></td>';
    html += '							<td class="w2"><input type="text" class="simpleinput select" style="width:140px" /></td>';
    html += '							<td class="cpu center-content"><input type="checkbox" class="simpleinput norange" style="width:30px" /></td>';
    html += '							<td class="glue center-content"><input type="checkbox" class="simpleinput norange" style="width:30px" /></td>';
    html += '							<td class="paz center-content"><input type="checkbox" class="simpleinput norange" style="width:30px" /></td>';
    html += '							<td class="pris center-content"><input type="checkbox" class="simpleinput norange" style="width:30px" /></td>';
    html += '							<td class="corner center-content"><input type="checkbox" class="simpleinput norange" style="width:30px" /></td>';
    html += '							<td class="upil center-content"><input type="checkbox" class="simpleinput norange" style="width:60px" /></td>';
    html += '							<td class="comment"><input type="text" class="simpleinput" style="width:120px" /></td>';
    html += '							<td class="delete center-content"><a class="icon-remove norange" id="' + pos + '"> </a></td>';
    html += '						</tr>';


    return html;
};

let atachTableEvents = function (id) {

//remove red formating on errored inputs
    $('#' + id + ' table tbody').on('click', 'input', function (event) {
        $(this).removeClass('red');
    });
//action delete line
    $('#' + id + ' table tbody').off('click', 'a');
    $('#' + id + ' table tbody').on('click', 'a', function (event) {
        if ($('#' + id + ' table tbody tr').length > 1) {
            $('#' + id + ' table tbody tr.line-' + $(this).attr('id')).remove();
            $('#' + id + ' table tbody tr').each(function (index) {
                let lineNum = index + 1;
                $(this).attr('class', 'line-' + lineNum);
                $(this).children('.pos').html(lineNum);
                $(this).attr('data-pos', lineNum);
                $(this).children('.delete').children('.icon-remove').attr('id', lineNum);
            });
        }
    });
//action change material modal open
    $('#editMat-' + id).on('click', function () {
        $('#oldmat').val(id);
        $('#materialchangemodal').modal('show');
    });

//select client mat open only glue adbs
    $('#clientMat-' + id).on('change', function () {
        if ($(this).prop('checked') == true) {
            $("#onlyAbs-" + id).prop('disabled', false);
        } else {
            $("#onlyAbs-" + id)
                .prop('checked', false)
                .prop('disabled', true);
        }

    });


//action import data from text
    $('#importtext-' + id).on('click', function () {
        $('#recieveMat').val(id);
        $('#importMod').modal('show');
    });
//action remove material
    $('#remove-' + id).on('click', removeMaterialList);
    $('#' + id + ' table tbody').on('click', 'input', function (event) {
        let row = $(event.currentTarget).parent().parent();
        let len = row.find("td.length").find("input").val();
        let wid = row.find("td.width").find("input").val();
        let drill = row.find("td.pris").find("input");
        let cpu = row.find("td.cpu").find("input");
        let paz = row.find("td.paz").find("input");
        let corner = row.find("td.corner").find("input");

        if ((len < 180 || wid < 70) && drill.prop("checked") === true) {
            row[0].style.backgroundColor = '#f2dede';

        } else if (
            (len < 420 || wid < 60) && drill.prop("checked") === true
            && (paz.prop("checked") == true || cpu.prop("checked") == true || corner.prop("checked") == true)
        ) {
            row[0].style.backgroundColor = '#f2dede';
        } else {
            row[0].style.backgroundColor = '#ffffff';
        }

    });
//action cursor movement
    $('#' + id + ' table tbody').on('keyup', 'td', function (event) {

        if (event.currentTarget.classList.contains("length") || event.currentTarget.classList.contains("width")) {
            let row = $(event.currentTarget).parent();

            let len = row.find("td.length").find("input").val();
            let wid = row.find("td.width").find("input").val();
            let drill = row.find("td.pris").find("input");
            let cpu = row.find("td.cpu").find("input");
            let paz = row.find("td.paz").find("input");
            let corner = row.find("td.corner").find("input");


            if (
                (len > 170 && len < 2800 && wid > 50 && wid < 900)
                || (wid > 170 && wid < 2800 && len > 50 && len < 900)
            ) {
                drill.prop("disabled", false);
            } else {
                drill.prop("disabled", true);
            }
            if ((len > 2450 || wid > 1200) && document.getElementById('tab-' + id).dataset.type == 6) {
                cpu.prop("disabled", true).prop("checked", false);
            } else {
                cpu.prop("disabled", false);
            }

        }


        if (event.which === 13 && ($(this).children().first().hasClass('select') || $(this).children().first().hasClass('norange'))) { //open select dialog
            let current = $(this).children().first();
            if (current.hasClass('norange')) {
                if (current.prop('checked')) {
                    current.prop('checked', false);
                } else {
                    current.prop('checked', true);
                }

            } else if (current.hasClass('select')) {
                $('#recieveinput').val(id + '-' + $(this).parent().attr("data-pos") + '-' + $(this).attr('class'));
                $('#absmodal').modal('show');
            }
            // console.log(caretPos, end);
        }
        if (event.which === 39 && $(this).children().first().hasClass('simpleinput')) { //go right

            let next = $(this).next().children().first();
            let current = $(this).children().first();
            if ($(this).next().hasClass('delete') && $(this).parent().next().length === 0) {
                let lineNum = parseInt($(this).parent().parent().children().length);
                lineNum++;
                $(this).parents('tbody').append(createWorkLine(lineNum));
                // populateAbs(id+' table tbody tr.line-'+lineNum);
                $(this).parent().next().children('.length').children().first().focus();
            } else {
                //console.log(next.hasClass('norange'));
                if (current.hasClass('norange') || current.hasClass('select')) {
                    next.focus();
                } else {
                    let caretPos = current.get(0).selectionStart;
                    let end = current.val().length;
                    if (caretPos == end) {
                        next.focus();
                    }
                }
            }

        }
        if (event.which === 37 && $(this).children().first().hasClass('simpleinput') && !$(this).prev().hasClass('pos')) { //go left
            let current = $(this).children().first();
            let prev = $(this).prev().children().first();

            if (current.hasClass('norange') || current.hasClass('select')) {
                prev.focus();
            } else {
                try {
                    let caretPos = current.get(0).selectionStart;
                    let end = prev.val().length;
                    if (caretPos == 0) {
                        prev.focus();
                        prev[0].setSelectionRange(end, end);
                    }
                } catch (e) {
                    //console.log(e);
                }
            }

        }
        if (event.which === 38 && $(this).children().first().hasClass('simpleinput')) { //go up
            let whereTo = $(this).attr('class').split(' ')[0];
            $(this).parent().prev().children('.' + whereTo).children().first().focus();
            //console.log($(this).parent().prev().children('.length'));
        }
        if (event.which === 40 && $(this).children().first().hasClass('simpleinput')) { //go down
            if ($(this).parent().next().length === 0) {

                let lineNum = parseInt($(this).parent().children('.pos').text());
                lineNum++;
                $(this).parents('tbody').append(createWorkLine(lineNum));
                // populateAbs(id+' table tbody tr.line-'+lineNum);
                $(this).parent().next().children('.length').children().first().focus();
            } else {
                // console.log($(this).attr('class'));
                let whereTo = $(this).attr('class').split(' ')[0];
                $(this).parent().next().children('.' + whereTo).children().first().focus();
            }

        }
        if (event.which === 9 && $(this).next().hasClass('delete')) { //go tab
            if ($(this).parent().next().length === 0) {
                let lineNum = parseInt($(this).parent().children('.pos').text());
                lineNum++;
                $(this).parents('tbody').append(createWorkLine(lineNum));
                // populateAbs(id+' table tbody tr.line-'+lineNum);
            }
            $(this).parent().next().children('.length').children().first().focus();
        }


    });

};

const collectInputData = function () {
    //orderObj={};
    const absMaterial = [];
    let x = 0;
    const error = [];
    let abs = 0;
    order.panels = {};
    let absList = document.querySelectorAll('#absList option');

    for (let i = 0; i < absList.length; i++) {
        let absItem = absList[i];

        if (absItem.value == '#' || absItem.value === undefined) {
            continue;
        }
        order.absData[absItem.value] = {};
        order.absData[absItem.value].totalLength = 0;
        order.absData[absItem.value].matName = absItem.innerText;
        order.absData[absItem.value].shortName = absItem.dataset.short;
        order.absData[absItem.value].thick = absItem.dataset.thick;
        order.absData[absItem.value].width = absItem.dataset.width;

    }

    $('#workArea div').each(function (index) {
        const id = $(this).attr('id');
        if(id === undefined){
            return;
        }
        const matName = $('#materialList li#tab-' + id + ' a span.name').text();

        const tableRows = $(this).find('table tbody tr');
        let y = 0;
        const tab = $('#materialList li#tab-' + id);

        order.panels['' + id] = {};
        order.panels['' + id].matName = matName;
        order.panels['' + id].id = this.dataset.specid;
        order.panels['' + id].clientMat = $(this).find('#clientMat-' + id).prop('checked');
        order.panels['' + id].onlyAbs = $(this).find('#onlyAbs-' + id).prop('checked');
        order.panels['' + id].origlength = tab.attr('data-length');
        order.panels['' + id].origwidth = tab.attr('data-width');
        order.panels['' + id].origthick = tab.attr('data-thick');
        order.panels['' + id].origtype = tab.attr('data-type');
        order.panels['' + id].params = [];
        tableRows.each(function () {
            order.panels['' + id].params[y] = {};

            order.panels['' + id].params[y].id = this.dataset.paramid;
            order.panels['' + id].params[y].pos = this.dataset.pos;
            order.panels['' + id].params[y].modelIndex = this.dataset.modelindex;

            const glue = $(this).find('.glue input').prop("checked");

            let length = +$(this).find('.length input').val();
            let width = +$(this).find('.width input').val();
            let num = +$(this).find('.num input').val();
            if (isNaN(length) || length == "" || length > order.panels['' + id].origlength) {
                $(this).find('.length input').addClass('red');
                error.push(1);
            }
            if (isNaN(width) || width == "" || width > order.panels['' + id].origwidth) {
                $(this).find('.width input').addClass('red');
                error.push(1);
            }
            if (isNaN(num) || num == "") {
                $(this).find('.num input').addClass('red');
                error.push(1);
            }

            if (length < 50) {
                $(this).find('.length input').addClass('red');
                error.push(1);

            }
            if (width < 25) {
                $(this).find('.width input').addClass('red');
                error.push(1);

            }


            order.panels['' + id].params[y].length = length;
            order.panels['' + id].params[y].width = width;
            order.panels['' + id].params[y].num = num;
            abs = +$(this).find('.l1 .select').attr('data-absid');

            if (!isNaN(abs) && $(this).find('.l1 .select').val() != "") {
                order.panels['' + id].params[y].l1 = abs;
            } else {
                order.panels['' + id].params[y].l1 = 0;
            }

            abs = +$(this).find('.l2 .select').attr('data-absid');
            if (!isNaN(abs) && $(this).find('.l2 .select').val() != "") {
                order.panels['' + id].params[y].l2 = abs;
            } else {
                order.panels['' + id].params[y].l2 = 0;
            }
            abs = +$(this).find('.w1 .select').attr('data-absid');
            if (!isNaN(abs) && $(this).find('.w1 .select').val() != "") {
                order.panels['' + id].params[y].w1 = abs;
            } else {
                order.panels['' + id].params[y].w1 = 0;
            }
            abs = +$(this).find('.w2 .select').attr('data-absid');
            if (!isNaN(abs) && $(this).find('.w2 .select').val() != "") {
                order.panels['' + id].params[y].w2 = abs;
            } else {
                order.panels['' + id].params[y].w2 = 0;
            }
            order.panels['' + id].params[y].cpu = $(this).find('.cpu input').prop("checked");
            order.panels['' + id].params[y].glue = $(this).find('.glue input').prop("checked");

            order.panels['' + id].params[y].paz = $(this).find('.paz input').prop("checked");
            if ($(this).find('.pris input').prop("disabled") !== true) {
                order.panels['' + id].params[y].pris = $(this).find('.pris input').prop("checked");
            } else {
                order.panels['' + id].params[y].pris = false;
            }

            order.panels['' + id].params[y].corner = $(this).find('.corner input').prop("checked");
            order.panels['' + id].params[y].upil = $(this).find('.upil input').prop("checked");
            order.panels['' + id].params[y].comment = $(this).find('.comment input').val();

            y++;
        });
        x++;
    });
    if (autos === 0) {
        if (Object.getOwnPropertyNames(order.panels).length === 0) {
            Core.Alert('Не выбрано ни одного материала!');
            return false;
        }
        for (let x = 0; x < error.length; x++) {
            if (error[x] === 1) {
                Core.Alert('Проверьте введённые данные!');
                return false;
            }
        }
    }

    const result = JSON.stringify(order);
    $('#result').val(result);
    return result;

};


let updateInit = function () {
    const bazisData = JSON.parse(window.localStorage.getItem("ORDER"));

    if (bazisData === null || bazisData.panels === undefined || Object.keys(bazisData.panels).length === 0) {
        return false;
    }
    $("#poliuretan").prop('checked', order.info.poliuretan);
    $("#drillProgramm").prop('checked', order.info.drillProgramm);
//return;

    if (bazisData.absData !== undefined) {
        for (let x in bazisData.absData) {

            let object = {};
            object.goods_id = x;
            object.name = bazisData.absData[x].matName;
            object.thick = bazisData.absData[x].thick;
            object.shortName = bazisData.absData[x].shortName;
            addAbsList(object);
        }
    }

    for (let gid in bazisData.panels) {
        if(gid === "undefined"){
            continue;
        }
        let material = bazisData.panels[gid];
        let object = {};
        let shortName = '';

        object.goods_id = gid;
        object.id = material.id;
        object.name = dsp[gid].name;
        object.length = material.origlength;
        object.width = material.origwidth;
        object.thick = material.origthick;
        object.goods_type = material.origtype;
        addMaterialList(object, true);

        $('#clientMat-' + gid).prop('checked', material.clientMat || false);

        if (material.clientMat) {
            $('#onlyAbs-' + gid)
                .prop('checked', material.onlyAbs || false)
                .prop('disabled', false);
        }

        let params = material.params;

        for (let y = 0; y < params.length; y++) {
            //if ob means it is an automaticaly added piece to consist offcuts that the client wants
            if (params[y]['ob'] != undefined) {
                continue;
            }
            if (y != 0) {
                $('#' + gid + ' table tbody').append(createWorkLine(y + 1));
            }
            let tableRow = $('#' + gid + ' table tbody tr.line-' + (y + 1));
            if (params[y].modelIndex != 0) {
                tableRow.find('.pos').html(params[y].modelIndex);
                tableRow.attr('data-modelindex', params[y].modelIndex);
            }
            tableRow.attr('data-paramid', params[y].id);
            tableRow.find('.length input').val(params[y].length);
            tableRow.find('.width input').val(params[y].width);
            tableRow.find('.num input').val(params[y].num);
            if (params[y].l1 != 0 && params[y].l1 != null) {

                shortName = bazisData.absData[params[y].l1].shortName;
                tableRow.find('.l1 .select').attr('data-absid', params[y].l1).val(shortName);
            }
            if (params[y].l2 != 0 && params[y].l2 != null) {
                shortName = bazisData.absData[params[y].l2].shortName;
                tableRow.find('.l2 .select').attr('data-absid', params[y].l2).val(shortName);
            }
            if (params[y].w1 != 0 && params[y].w1 != null) {
                shortName = bazisData.absData[params[y].w1].shortName;
                tableRow.find('.w1 .select').attr('data-absid', params[y].w1).val(shortName);
            }
            if (params[y].w2 != 0 && params[y].w2 != null) {
                shortName = bazisData.absData[params[y].w2].shortName;
                tableRow.find('.w2 .select').attr('data-absid', params[y].w2).val(shortName);
            }
            if (params[y].corner) tableRow.find('.corner input').prop('checked', true);
            if (params[y].cpu) tableRow.find('.cpu input').prop('checked', true);
            if (params[y].glue) tableRow.find('.glue input').prop('checked', true);

            if (params[y].paz) tableRow.find('.paz input').prop('checked', true);
            if (params[y].pris) tableRow.find('.pris input').prop('checked', true);
            if (params[y].upil) tableRow.find('.upil input').prop('checked', true);
            if (params[y].comment) tableRow.find('.comment input').val(params[y].comment);
        }

    }

};

const filterList = function (query) {
    let html = '';
    if (query === undefined) {
        query = ''
    }

    for (let item in absList) {
        // Create a string like a.*b.*c.*
        let squery = query.replace('*', '.').split('.').join('.*');
        if (absList[item]['name'].match(new RegExp(squery, 'ig'))) {
            html += '<option class="' + absList[item].goods_id + '" value=' + absList[item].goods_id + ' data-index="' + item + '" data-thick="' + absList[item]['thick'] + '" data-type="' + absList[item]['goods_type'] + '">' + absList[item]['name'] + '</option>';
        }

    }
    return html;

};


$(document).ready(function () {

    updateInit();

    $('#absInitSelect').html(filterList());

    $('#filterQuery').on('keyup', function () {

        $('#absInitSelect').html(filterList($(this).val()));

    });


    $('#absInitSelect').on('dblclick', 'option', function () {
        console.log($(this).data('index'));
        addAbsList(absList[$(this).data('index')]);
    });

    $('#materialList').on('change', function () {
        $('.activeWork').removeClass("activeWork").addClass("hidden");
        $('#' + $(this).val()).removeClass("hidden").addClass("activeWork");
    });

    $("#poliuretan").on("change", function () {
        order.info["poliuretan"] = $(this).prop('checked');
    });
    $("#drillProgramm").on("change", function () {
        order.info["drillProgramm"] = $(this).prop('checked');
    });

    $('#save').on('click', function () {
        $('#grey').show();
        $('#loading').show();
        let collected = collectInputData();
        window.localStorage.setItem("ORDER", collected);
        if (collected === false) {
            $('#grey').hide();
            $('#loading').hide();
            return;
        }

        const post = {
            "order": collected
        };
        c.act("post", "controller.php", post, function (data) {
            $('#grey').hide();
            $('#loading').hide();
            const file = data.content;
            const name = data.name;

            const link = document.createElement('a');
            link.href = "data:application/zip;base64, " + file;
            link.target = "_blank";
            link.download = "order.nerm";

            if (name !== undefined) {
                link.download = name;
            }
            link.click();

        });
    });

    $('#reset').on('click', function () {
        const result = {
            order_id: 0,
            orderName: "WebOrder",
            order_type: 1,
            abs: [],
            materials: [],
            absData: {},
            panels: {},
            info: {
                "poliuretan": false,
                "drillProgramm": true

            }
        };
        window.localStorage.setItem("ORDER", JSON.stringify(result));
        window.location.reload();
    });


    $('#deleteAbs').on('click', removeAbsList);

    $('#addAbs').on('click', function () {
        $('#filterQuery').show();
        $('#absInitSelect').show();
        $('#absList').attr('size', 5);
        $('#absmodal').modal('show');
        $('#recieveinput').val('');
    });

    $('#closeabsmodal').on('click', function () {
        let where = $('#recieveinput').val().split('-');
        if (where.length === 2) {
            let selected = $(this).children().filter(":selected");

            $('#' + where[0] + ' table tbody tr.line-' + where[1] + ' td.' + where[2]).children().first().attr('data-absid', selected.val()).val(selected.attr('data-short'));
            $('#' + where[0] + ' table tbody tr.line-' + where[1] + ' td.' + where[2]).children().first().focus();
        }
        $('#absmodal').modal('hide');
    });

    $('#absmodal').on('shown', function () {
        $('#absList').focus();
    });

    $('#absmodal').on('hidden', function () {
        $('#filterQuery').hide();
        $('#absInitSelect').hide();
        $('#absList').attr('size', 25);
    });

    $('#absList').on('keyup', function (event) {
        if (event.which === 13) {
            let where = $('#recieveinput').val().split('-');
            let selected = $(this).children().filter(":selected");
            $('#' + where[0] + ' table tbody tr.line-' + where[1] + ' td.' + where[2]).children().first().attr('data-absid', selected.val()).val(selected.attr('data-short'));
            $('#' + where[0] + ' table tbody tr.line-' + where[1] + ' td.' + where[2]).children().first().focus();
            $('#absmodal').modal('hide');
        }
    });

    $('#closeImportmodal').on('click', function () {
        $('#importMod').modal('hide');
        let importData = $('#textareaMod').val();
        let id = $('#recieveMat').val();
        importData = importData.split("\n");
        let nextInLine = +$('#' + id + ' table tbody tr').last().attr("class").split('-')[1];
        if (nextInLine != 1) {
            nextInLine++;
        } else {
            $('#' + id + ' table tbody tr').last().remove();
        }


        for (let x = 0; x < importData.length; x++) {
            let line = importData[x].split("\t");
            //console.log($('#'+id+' table tbody'));

            if (line.length >= 3) {
                $('#' + id + ' table tbody').append(createWorkLine(nextInLine + x));
                let row = $('#' + id + ' table tbody tr.line-' + (nextInLine + x));
                if (!isNaN(+line[0])) {
                    row.find('.length input').val(line[0]);
                } else {
                    row.find('.length input').addClass('red');
                }
                if (!isNaN(+line[1])) {
                    row.find('.width input').val(line[1]);
                } else {
                    row.find('.width input').addClass('red');
                }
                if (!isNaN(+line[2])) {
                    row.find('.num input').val(line[2]);
                } else {
                    row.find('.num input').addClass('red');
                }
            }
        }
    });

});

