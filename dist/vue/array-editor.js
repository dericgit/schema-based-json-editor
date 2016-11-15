"use strict";
var common = require("../common");
/* tslint:disable:only-arrow-functions */
/* tslint:disable:no-unused-new */
/* tslint:disable:object-literal-shorthand */
exports.arrayEditor = {
    template: "\n    <div :class=\"errorMessage ? theme.errorRow : theme.row\">\n        <h3>\n            {{title || schema.title}}\n            <div :class=\"theme.buttonGroup\" :style=\"buttonGroupStyleString\">\n                <button :class=\"theme.button\" @click=\"collapseOrExpand()\">\n                    <icon :icon=\"icon\" :text=\"collapsed ? icon.expand : icon.collapse\"></icon>\n                </button>\n                <button v-if=\"!readonly && value !== undefined\" :class=\"theme.button\" @click=\"addItem()\">\n                    <icon :icon=\"icon\" :text=\"icon.add\"></icon>\n                </button>\n                <button v-if=\"hasDeleteButton && !readonly && !schema.readonly\" :class=\"theme.button\" @click=\"$emit('delete')\">\n                    <icon :icon=\"icon\" :text=\"icon.delete\"></icon>\n                </button>\n            </div>\n        </h3>\n        <p :class=\"theme.help\">{{schema.description}}</p>\n        <div v-if=\"!required\" :class=\"theme.optionalCheckbox\">\n            <label>\n                <input type=\"checkbox\" @change=\"toggleOptional()\" :checked=\"value === undefined\" />\n                is undefined\n            </label>\n        </div>\n        <div :class=\"theme.rowContainer\">\n            <div v-for=\"(item, i) in getValue\" :key=\"(1 + i) * renderSwitch\" :data-index=\"i\" :class=\"theme.rowContainer\">\n                <editor :schema=\"schema.items\"\n                    :title=\"i\"\n                    :initial-value=\"value[i]\"\n                    @update-value=\"onChange(i, arguments[0])\"\n                    :theme=\"theme\"\n                    :icon=\"icon\"\n                    :locale=\"locale\"\n                    :required=\"true\"\n                    :readonly=\"readonly || schema.readonly\"\n                    @delete=\"onDeleteFunction(i)\"\n                    :has-delete-button=\"true\">\n                </editor>\n            </div>\n        </div>\n        <p v-if=\"errorMessage\" :class=\"theme.help\">{{errorMessage}}</p>\n    </div>\n    ",
    props: ["schema", "initialValue", "title", "theme", "icon", "locale", "readonly", "required", "hasDeleteButton"],
    data: function () {
        var value = common.getDefaultValue(this.required, this.schema, this.initialValue);
        this.$emit("update-value", { value: value, isValid: !this.errorMessage });
        return {
            renderSwitch: 1,
            collapsed: false,
            value: value,
            drak: undefined,
            errorMessage: undefined,
            buttonGroupStyleString: common.buttonGroupStyleString,
        };
    },
    beforeDestroy: function () {
        if (this.drak) {
            this.drak.destroy();
        }
    },
    computed: {
        getValue: function () {
            if (this.value !== undefined && !this.collapsed) {
                return this.value;
            }
            return [];
        },
    },
    mounted: function () {
        var _this = this;
        var container = this.$el.childNodes[6];
        this.drak = common.dragula([container]);
        this.drak.on("drop", function (el, target, source, sibling) {
            if (_this.value) {
                common.switchItem(_this.value, el, sibling);
                _this.renderSwitch = -_this.renderSwitch;
                _this.$emit("update-value", { value: _this.value, isValid: !_this.errorMessage });
            }
        });
    },
    methods: {
        collapseOrExpand: function () {
            this.collapsed = !this.collapsed;
        },
        toggleOptional: function () {
            this.value = common.toggleOptional(this.value, this.schema, this.initialValue);
            this.validate();
            this.$emit("update-value", { value: this.value, isValid: !this.errorMessage });
        },
        validate: function () {
            this.errorMessage = common.getErrorMessageOfArray(this.value, this.schema, this.locale);
        },
        addItem: function () {
            this.value.push(common.getDefaultValue(true, this.schema.items, undefined));
            this.$emit("update-value", { value: this.value, isValid: !this.errorMessage });
        },
        onDeleteFunction: function (i) {
            this.value.splice(i, 1);
            this.renderSwitch = -this.renderSwitch;
            this.validate();
            this.$emit("update-value", { value: this.value, isValid: !this.errorMessage });
        },
        onChange: function (i, _a) {
            var value = _a.value, isValid = _a.isValid;
            this.value[i] = value;
            this.validate();
            this.$emit("update-value", { value: this.value, isValid: !this.errorMessage && isValid });
        },
    },
};
//# sourceMappingURL=array-editor.js.map