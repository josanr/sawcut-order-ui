/**
 * Created by ruslan on 05.07.2017.
 */

'use strict';

/**
 *
 * @param {Object} options       Options
 * @param {Object} options.list - Item list
 * @param {Object} options.node - table rows to work with
 * @param {string} options.pk - Primary key in list
 * @param {string} options.addin - HTML for additional colums
 * @param {string[]} options.filterEx - List of excluded from filter columns
 *
 * @constructor
 */
function Tables(options) {

    this.list = options.list || {};
    this.fList = [];

    //read colums from table jquery object
    if (options.node instanceof jQuery) {
        this.colList = [];
        var self = this;
        this.wrapper = options.node;
        this.tbody = this.wrapper.find('tbody');

        var headRows = this.wrapper.children('thead').find('th');
        headRows.each(function (i) {
            if ($(this).attr('data-col')) {
                self.colList.push($(this).attr('data-col'));
            }
        });
    } else {
        throw new Error('Wrapper not Jquery object');

    }

    if (options.pk === undefined) {
        throw new Error('Index undefined');
    }
    this.idName = options.pk;

    this.addin = options.addin;
    if (options.filterEx === undefined) {
        this.exclude = [];
    } else {
        this.exclude = options.filterEx;
    }


}

Tables.prototype.filter = function (query) {
    this.fList = [];
    var temp;
    if (query === undefined) {
        query = '*';
    }
    // Create a string like a.*b.*c.*
    var squery = query.split('*').join('.*');

    //for every row
    for (var item in this.list) {
        temp = '';

        //for every column
        for (var x in this.colList) {
            var column = this.colList[x];

            if (this.exclude.indexOf(column) !== -1) {
                continue;
            }

            if (this.list[item][column] != undefined) {
                temp += ' ' + this.list[item][this.colList[x]];

            }
        }
        if (temp.match(new RegExp(squery, 'ig'))) {
            //this.fList[item] = this.list[item];
            this.fList.push(item);
        }


    }
    return this;
};

Tables.prototype.getSel = function () {
    var i;
    var ret = [];
    for (i in this.list) {
        var item = this.list[i];
        if (item._selected) {
            ret.push(i);
        }
    }
    return ret;
};


Tables.prototype.setSel = function (ids, selector) {
    var i;
    //var rows = this.node.find(selector);
    for (i in ids) {
        this.list[i]._selected = true;
        this.tbody.find('tr[data-id=' + i + ']').find(selector).prop('checked', true);
    }
};
/**
 *
 * @returns rowid
 *
 */
Tables.prototype.rowEve = function (action) {

    this.tbody.on('click', 'tr', function (e) {
        var sel = getSelection().toString();
        if (!sel) {
            action($(this).attr('data-id'));
        }
    })
};
/**
 *
 * @returns rowid, colID, cellObject
 *
 */
Tables.prototype.cellEve = function (action) {

    this.tbody.on('click', 'td', function (e) {
        var sel = getSelection().toString();
        var col;
        if (!sel) {
            if ($(this).attr('data-col')) {
                col = $(this).attr('data-col');
            } else {
                col = null;
            }
            action($(this).parent('tr').attr('data-id'), col, $(this));
        }
    })
};


Tables.prototype.render = function () {

    var html = '';
    var tail = '';
    var x, id, item;
    if (this.addin != undefined) {
        tail = this.addin;
    }

    for (x = 0; x < this.fList.length; x++) {
        id = this.fList[x];

        html += '<tr data-id="' + this.list[id][this.idName] + '">';
        for (var y in this.colList) {
            var text = '';
            if (this.list[id][this.colList[y]] !== null && this.list[id][this.colList[y]] !== undefined) {
                text = this.list[id][this.colList[y]];
            }
            html += '<td data-col="' + this.colList[y] + '">' + text + '</td>';
        }
        html += tail + '</tr>';
    }
    this.tbody.html(html);
};

Tables.prototype.update = function (data) {
    this.list = data;
    this.fList = [];
    var item;
    for (item in this.list) {
        this.fList.push(item);
    }
    return this;
};
