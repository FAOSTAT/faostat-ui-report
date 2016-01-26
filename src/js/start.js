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
        'fs-r-t/start',
        'FAOSTAT_UI_DOWNLOAD_SELECTORS_MANAGER',
        'amplify'
    ],
    function ($, log, C, E, Common, _, Handlebars, template, ReportTable, DownloadSelectorsManager) {

        'use strict';

        var s = {

            SELECTORS: 'report_selectors',
            REPORT_TABLE: '[data-role=table]',
            EXPORT_BUTTON: '[data-role=export]',
            PREVIEW_BUTTON: '[data-role=preview]'

        },
        defaultOptions = {

            request: {
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
            this.$CONTAINER.html(t({}));

            this.$SELECTORS = this.$CONTAINER.find(s.SELECTORS);
            this.$REPORT_TABLE = this.$CONTAINER.find(s.REPORT_TABLE);
            this.$EXPORT_BUTTON = this.$CONTAINER.find(s.EXPORT_BUTTON);
            this.$PREVIEW_BUTTON = this.$CONTAINER.find(s.PREVIEW_BUTTON);

            this.reportTable = new ReportTable();
        };

        Report.prototype.initComponents  = function () {

            var self = this;

            /* Initiate components. */
            this.download_selectors_manager = new DownloadSelectorsManager();

            /* Initiate selectors. */
            this.download_selectors_manager.init({
                lang: Common.getLocale(),
                placeholder_id: s.SELECTORS,
                domain: this.o.code,
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

            var userSelection = this.download_selectors_manager.get_user_selection(),
                obj = {
                    List1Codes: userSelection.list1Codes || null,
                    List2Codes: userSelection.list2Codes || null,
                    List3Codes: userSelection.list3Codes || null,
                    List4Codes: userSelection.list4Codes || null,
                    List5Codes: userSelection.list5Codes || null,
                    List6Codes: userSelection.list6Codes || null,
                    List7Codes: userSelection.list7Codes || null,
                    List1AltCodes: userSelection.list1AltCodes || null,
                    List2AltCodes: userSelection.list2AltCodes || null,
                    List3AltCodes: userSelection.list3AltCodes || null,
                    List4AltCodes: userSelection.list4AltCodes || null,
                    List5AltCodes: userSelection.list5AltCodes || null,
                    List6AltCodes: userSelection.list6AltCodes || null,
                    List7AltCodes: userSelection.list7AltCodes || null
                };

            return $.extend(true, {}, {domain_code: this.o.code}, obj);
        };

        Report.prototype.isNotRendered = function () {
            return this.$CONTAINER === undefined;
        };

        Report.prototype.bindEventListeners = function () {

            var self = this;

            this.$PREVIEW_BUTTON.on('click', function() {
                self.table('preview');
            });
            this.$EXPORT_BUTTON.on('click', function() {
                self.table('export');
            });

        };

        Report.prototype.unbindEventListeners = function () {
            this.$PREVIEW_BUTTON.off();
            this.$EXPORT_BUTTON.off();
        };

        Report.prototype.destroy = function () {

            this.unbindEventListeners();

            this.$CONTAINER.empty();

        };

        return Report;
    });