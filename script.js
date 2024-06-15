$(document).ready(function() {
    let debounceTimer;

    // Initialize sliders
    $("#startRowSlider").slider({
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#startRow").val(ui.value);
            debounceValidateAndGenerateTable();
        }
    });

    $("#endRowSlider").slider({
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#endRow").val(ui.value);
            debounceValidateAndGenerateTable();
        }
    });

    $("#startColSlider").slider({
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#startCol").val(ui.value);
            debounceValidateAndGenerateTable();
        }
    });

    $("#endColSlider").slider({
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#endCol").val(ui.value);
            debounceValidateAndGenerateTable();
        }
    });

    // Connect input fields to sliders
    $("#startRow, #endRow, #startCol, #endCol").on('input', function() {
        $("#startRowSlider").slider('value', $("#startRow").val());
        $("#endRowSlider").slider('value', $("#endRow").val());
        $("#startColSlider").slider('value', $("#startCol").val());
        $("#endColSlider").slider('value', $("#endCol").val());
        debounceValidateAndGenerateTable();
    });

    function debounceValidateAndGenerateTable() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(validateAndGenerateTable, 300);
    }

    // To check input ranges
    $.validator.addMethod("validRange", function(value, element, params) {
        const startRow = parseInt($("#startRow").val());
        const endRow = parseInt($("#endRow").val());
        const startCol = parseInt($("#startCol").val());
        const endCol = parseInt($("#endCol").val());

        if (isNaN(startRow) || isNaN(endRow) || isNaN(startCol) || isNaN(endCol)) {
            return true; // Don't check ranges if any field is empty
        }

        if (element.id === "startRow" || element.id === "endRow") {
            return startRow <= endRow;
        } else if (element.id === "startCol" || element.id === "endCol") {
            return startCol <= endCol;
        }

        return true;
    }, "Start value must be less than or equal to end value.");

    // Initialize jQuery validation
    $("#multiplicationForm").validate({
        errorClass: "error",
        rules: {
            startRow: { required: true, number: true, range: [-50, 50], validRange: true },
            endRow: { required: true, number: true, range: [-50, 50], validRange: true },
            startCol: { required: true, number: true, range: [-50, 50], validRange: true },
            endCol: { required: true, number: true, range: [-50, 50], validRange: true }
        },
        messages: {
            startRow: {
                required: "Please enter a start row",
                number: "Please enter a valid number",
                range: "Please enter a number between -50 and 50"
            },
            endRow: {
                required: "Please enter an end row",
                number: "Please enter a valid number",
                range: "Please enter a number between -50 and 50"
            },
            startCol: {
                required: "Please enter a start column",
                number: "Please enter a valid number",
                range: "Please enter a number between -50 and 50"
            },
            endCol: {
                required: "Please enter an end column",
                number: "Please enter a valid number",
                range: "Please enter a number between -50 and 50"
            }
        },
        onfocusout: function(element) {
            // Only validate if the element is filled
            if ($(element).val() !== "") {
                $(element).valid();
            }
        },
        errorPlacement: function(error, element) {
            error.insertAfter(element);
        },
        highlight: function(element, errorClass) {
            $(element).addClass(errorClass);
        },
        unhighlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },
        submitHandler: function(form) {
            validateAndGenerateTable();
        }
    });

    // Initialize jQuery UI tabs
    $("#tabs").tabs();

    function validateAndGenerateTable() {
        if ($("#multiplicationForm").valid()) {
            generateTable();
        }
    }

    function generateTable() {
        const startRow = parseInt($("#startRow").val());
        const endRow = parseInt($("#endRow").val());
        const startCol = parseInt($("#startCol").val());
        const endCol = parseInt($("#endCol").val());

        let table = '<table><thead><tr><th class="fixed-header"></th>';
        for (let col = startCol; col <= endCol; col++) {
            table += `<th class="fixed-header">${col}</th>`;
        }
        table += '</tr></thead><tbody>';
        for (let row = startRow; row <= endRow; row++) {
            table += `<tr><th class="fixed-header">${row}</th>`;
            for (let col = startCol; col <= endCol; col++) {
                table += `<td>${row * col}</td>`;
            }
            table += '</tr>';
        }
        table += '</tbody></table>';

        const tabTitle = `${startRow} to ${endRow}, ${startCol} to ${endCol}`;
        const tabId = `tabs-${$("#tabs ul li").length + 1}`;

        // Add the new tab
        $("#tabs ul").append(`<li><input type="checkbox" class="select-tab" data-tab="${tabId}"><a href="#${tabId}">${tabTitle}</a> <button class="close-tab" data-tab="${tabId}">x</button></li>`);
        $("#tabs").append(`<div id="${tabId}">${table}</div>`);
        $("#tabs").tabs("refresh");

        // Activate the new tab
        $("#tabs").tabs("option", "active", $("#tabs ul li").length - 1);

        // Show delete button if tabs exist
        if ($("#tabs ul li").length > 0) {
            $("#deleteSelectedTabs").show();
        }

        // The close button
        $(".close-tab").on("click", function() {
            const tabId = $(this).data("tab");
            $(`a[href='#${tabId}']`).closest("li").remove();
            $(`#${tabId}`).remove();
            $("#tabs").tabs("refresh");

            // Hide delete button if no tabs exist
            if ($("#tabs ul li").length === 0) {
                $("#deleteSelectedTabs").hide();
            }
        });
    }

    // Delete selected tabs
    $("#deleteSelectedTabs").on("click", function() {
        $(".select-tab:checked").each(function() {
            const tabId = $(this).data("tab");
            $(`a[href='#${tabId}']`).closest("li").remove();
            $(`#${tabId}`).remove();
        });
        $("#tabs").tabs("refresh");

        // Hide delete button if no tabs exist
        if ($("#tabs ul li").length === 0) {
            $("#deleteSelectedTabs").hide();
        }
    });
});