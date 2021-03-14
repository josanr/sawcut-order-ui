<?php
/**
 * @var $bazisData array
 * @var $abs       array
 * @var $dsp       array
 */
$id = 0;
$bazisData = [];
$abs = [];
$dsp = [];

require_once ("components/header.php");
require_once ("db/db.php")
?>

    <style>
        .nav-tabs > li .close {
            margin: -2px 0 0 10px;
            font-size: 18px;
        }
    </style>
    <script>
        let absList = <?= $absList; ?>;
        let dsp = <?= $plateList; ?>;
    </script>
    <div class="row-fluid">
        <div class="well well-small">
            <div class="row-fluid">
                <div id="materialWrapper" class="span4">
                    <input type="text" class="input-block-level" placeholder="Поиск листового материала" tabindex="2"
                           autocomplete="off" name="typeaheadDsp" id="goodsSearch"/>
                </div>
                <div class="span2">
                    <button id="addAbs" class="btn input-block-level">Добавить кромку</button>
                </div>
                <div class="span2">
                    <label class="checkbox" style="line-height: 30px">
                        <input type="checkbox" id="poliuretan" style="margin-top: 8px; margin-bottom: 8px;">
                        Полиуретан
                    </label>
                </div>
                <div class="span2" style="display: <?= ($bazisData['order_type'] == 2) ? 'none' : 'block'; ?>">
                    <label class="checkbox" style="">
                        <input type="checkbox" id="drillProgramm" style="margin-top: 8px; margin-bottom: 8px;">
                        Нужна <br/>программа присадки
                    </label>
                </div>
            </div>
        </div>
    </div>

    <ul id="materialList" class="nav nav-tabs">

    </ul>
    <div class="row-fluid">
        <div id="workArea" class="span12 tab-content">

        </div>
    </div>


    <button id="save" class="btn btn-primary pull-right">Сохранить</button>
    <button id="reset" class="btn">Сбросить</button>


    <div id="absmodal" class="modal hide">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h3>Список кромочного материала</h3>
        </div>
        <div class="modal-body" style="height:500px;max-height:800px">
            <input type="hidden" id="recieveinput" value="0">
            <div id="absWrapper" class="span5">
                <input type="text" id="filterQuery" style="display:none"/>
                <select id="absInitSelect" class="span5" size="13" style="display:none">
                </select>

                <select id="absList" class="span5" size="25">
                    <option value="#"></option>
                </select>
                <button id="deleteAbs" class="btn btn-warning">Удалить</button>
            </div>
        </div>
        <div class="modal-footer">
            <a href="#" id="closeabsmodal" class="btn">Закрыть</a>
        </div>
    </div>


    <div id="importMod" class="modal hide">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h3>Вставте список из Excel</h3>
        </div>
        <div class="modal-body" style="height:350px">
            <input type="hidden" id="recieveMat" value="0">
            <textarea id="textareaMod" style="width:90%; height:90%">
</textarea>
        </div>
        <div class="modal-footer">
            <a href="#" id="closeImportmodal" class="btn btn-primary">Импортировать</a>
            <a href="#" id="" class="btn">Закрыть</a>

        </div>
    </div>


    <div id="materialchangemodal" class="modal hide">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h3>Изменить материал</h3>
        </div>
        <div class="modal-body" style="height:500px;max-height:800px">
            <input type="hidden" id="oldmat" value="0">
            <input type="hidden" id="newmat" value="0">
            <div id="materialchangeWrapper" class="span5">
                <input type="text" class="span5" placeholder="Поиск листового материала" tabindex="2" autocomplete="off"
                       id="exchangeMat"/>
            </div>
        </div>
        <div class="modal-footer">
            <a href="#" data-dismiss="modal" class="btn">Закрыть</a>
        </div>
    </div>

    <script src="js/index.min.js?<?= time();?>"></script>

    <script>
        var dsps = [];
        var mapDsp = {};
        $('#goodsSearch').typeahead({
            'source': function (query, process) {

                dsps = [];
                mapDsp = {};
                var data = dsp;

                $.each(data, function (i, dsp) {
                    mapDsp[dsp.name] = dsp;
                    dsps.push(dsp.name);
                });

                process(dsps);
            },
            'items': 25,
            matcher: function (item) {
                if (!this.query) return false;
                const squery = this.query.split('*').join('.*');
                return item.match(new RegExp(squery, 'ig'));
            },
            'minLength': 1,
            'updater': function (item) {
                addMaterialList(mapDsp[item]);
            }
        });
        $('#exchangeMat').typeahead({
            'source': function (query, process) {

                dsps = [];
                mapDsp = {};

                $.each(dsp, function (i, dsp) {
                    mapDsp[dsp.name] = dsp;
                    dsps.push(dsp.name);
                });

                process(dsps);
            },
            'items': 25,
            matcher: function (item) {
                if (!this.query) return false;
                const squery = this.query.split('*').join('.*');
                return item.match(new RegExp(squery, 'ig'));
            },
            'minLength': 1,
            'updater': function (item) {
                exchangeMat(mapDsp[item]);

            }
        });

    </script>


<?php
require_once ("components/footer.php");