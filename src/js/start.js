/* global define, console, amplify */
define([
        'jquery',
        'loglevel',
        'config/Config',
        'config/Events',
        'globals/Common',
        'underscore',
        'handlebars',
        'text!fs-r-p/html/templates/base_template.hbs',
        //'i18n!fs-r-p/nls/translate',
        'i18n!nls/download',
        'fs-r-t/start',
        'fs-s-m/start',
        'amplify'
    ],
    function ($, log, C, E, Common, _, Handlebars, template, i18nLabels, ReportTable, DownloadSelectorsManager) {

        'use strict';

        var s = {

            SELECTORS: '[data-role="report_selectors"]',
            REPORT_TABLE: '[data-role=table]',
            EXPORT_BUTTON: '[data-role=export]',
            PREVIEW_BUTTON: '[data-role=preview]',
            METADATA_BUTTON: '[data-role="metadata"]'

        },
        defaultOptions = {

            DEFAULT_REQUEST: {
                List1Codes: null,
                List2Codes: null,
                List3Codes: null,
                List4Codes: null,
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                List1AltCodes: null,
                List2AltCodes: null,
                List3AltCodes: null,
                List4AltCodes: null,
                List5AltCodes: null,
                List6AltCodes: null,
                List7AltCodes: null
            }

        };

        function Report() {

            return this;
        }

        Report.prototype.init = function (config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            this.initVariables();
            this.initComponents();
            this.configurePage();
            this.bindEventListeners();
        };

        Report.prototype.initVariables = function () {

            this.$CONTAINER = $(this.o.container);

            var t = Handlebars.compile(template);
            this.$CONTAINER.html(t(i18nLabels));

            this.$SELECTORS = this.$CONTAINER.find(s.SELECTORS);
            this.$REPORT_TABLE = this.$CONTAINER.find(s.REPORT_TABLE);
            this.$EXPORT_BUTTON = this.$CONTAINER.find(s.EXPORT_BUTTON);
            this.$PREVIEW_BUTTON = this.$CONTAINER.find(s.PREVIEW_BUTTON);
            this.$METADATA_BUTTON = this.$CONTAINER.find(s.METADATA_BUTTON);

            this.reportTable = new ReportTable();
        };

        Report.prototype.initComponents  = function () {

            var self = this;

            /* Initiate components. */
            this.selectorsManager = new DownloadSelectorsManager();

            /* Initiate selectors. */
            this.selectorsManager.init({
                lang: Common.getLocale(),
                container: s.SELECTORS,
                code: this.o.code,
                report_code: this.o.code,
                multiple: false,
                callback: {
                    onSelectionChange: function () {
                        self.$REPORT_TABLE.empty();
                    }
                }
            });

        };

        Report.prototype.configurePage  = function () {

        };

        Report.prototype.table  = function (type) {

            this.reportTable.init({
                container: this.$REPORT_TABLE,
                request: this.getRequestObject()
            });

            log.info(this.reportTable);

            if ( type === 'export') {
                this.reportTable.export();
            }

            if ( type === 'preview') {
                this.reportTable.render();
            }

        };

        Report.prototype.getRequestObject = function () {

            var selections = this.selectorsManager.getSelections(),
                request = $.extend(true, {}, this.o.DEFAULT_REQUEST, {domain_code: this.o.code});

            _.each(selections, function(d) {
                $.extend(true, request, d.request);
            });

            return request;
        };

        Report.prototype.selectionChange = function () {

            log.info('Report.selectionChange;');

            this.$REPORT_TABLE.empty();

        };

        Report.prototype.bindEventListeners = function () {

            var self = this;

            this.$PREVIEW_BUTTON.on('click', function() {
                self.table('preview');
            });

            this.$EXPORT_BUTTON.on('click', function() {
                self.table('export');
            });

            this.$METADATA_BUTTON.on('click', function () {
                amplify.publish(E.METADATA_SHOW, {
                    code: self.o.code
                });
            });

            amplify.subscribe(E.DOWNLOAD_SELECTION_CHANGE, this, this.selectionChange);

        };

        Report.prototype.unbindEventListeners = function () {
            this.$PREVIEW_BUTTON.off('click');
            this.$EXPORT_BUTTON.off('click');
            this.$METADATA_BUTTON.off('click');
        };

        Report.prototype.destroy = function () {

            this.unbindEventListeners();

            this.$CONTAINER.empty();

        };

        return Report;
    });