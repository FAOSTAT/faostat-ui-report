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
        'amplify'
    ],
    function ($, log, C, E, Common, _, Handlebars, template, ReportTable) {

        'use strict';

        var s = {

            SELECTORS: '[data-role=selectors]',
            REPORT_TABLE: '[data-role=table]',
            EXPORT_BUTTON: '[data-role=export]',
            PREVIEW_BUTTON: '[data-role=preview]'

        },
        defaultOptions = {

        };

        function Report() {

            return this;
        }

        Report.prototype.init = function (config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            this.initVariables();
            this.initComponents();
            this.configurePage();
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

        };

        Report.prototype.configurePage  = function () {

            this.reportTable.init({
                container: this.$REPORT_TABLE,
                request: {
                    domain_code: this.o.domain,
                    List1Codes: [9],
                    List2Codes: [2011]
                }
            });

            this.reportTable.render();
        };

        Report.prototype.isNotRendered = function () {
            return this.$CONTAINER === undefined;
        };

        Report.prototype.bindEventListeners = function () {

        };

        Report.prototype.unbindEventListeners = function () {

        };


        Report.prototype.destroy = function () {

            this.unbindEventListeners();

        };

        return Report;
    });