var options = {
    modules: {
        toolbar: {
            container: '#toolbar',
            handlers: {
                image: function () {
                    $("#selectedImage").click();
                },
                clean: function () {
                    let index = 0;
                    let range = this.quill.getSelection();
                    if (null != range && null != range.index) {
                        index = range.index;
                    }
                    this.quill.clipboard.dangerouslyPasteHTML(
                        index,
                        '<br/><p class="ql-align-center"><span class="ql-size-large">...</span></p>'
                    );
                }
            }
        }
    },
    placeholder: 'What did you think of the book?',
    theme: 'snow'
};
var quill = null;
var arrImageBase64 = [];
var imageBase64 = '';

//  custom image
$("#selectedImage").on("change", function () {
    const file = $("#selectedImage")[0].files[0];
    // file type is only image and less than 1MB
    if (/^image\//.test(file.type) && file.size / 1048576 < 1) {
        convertImageToBase64(file);
    } else {
        alert("Định dạng không phù hợp hoặc dung lượng ảnh lớn hơn 1M");
    }
    $("#selectedImage").val('');
});

function initEditor(placeholder) {
    options.placeholder = placeholder;
    quill = new Quill('#editor', options);
    quill.on('selection-change', function (range, oldRange, source) {
        if (range) {
            var format = quill.getFormat(range);
            changeButtonIcon(format);
        }
    });
}

function setReviewContent(reviewContent) {
    quill.clipboard.dangerouslyPasteHTML(
        index,
        reviewContent
    );
}

function getReviewContentHTML(arrImage) {
    // Get html 
    var contentHtml = $(".ql-editor")[0].innerHTML;
    // Replace base64 -> url
    arrImage.forEach(element => {
        contentHtml.replace(arrImageBase64[index], element);
    });
    return contentHtml;
}

function getReviewIntro() {
    var contentHtml = $(".ql-editor")[0].innerHTML;
    console.log('test', contentHtml);
    if (contentHtml) {
        console.log('ahihi', contentHtml.replace(/<\/?[^>]+(>|$)/g, ""));
        return contentHtml.replace(/<\/?[^>]+(>|$)/g, "");
    }
    return '';
}

function getArrImageBase64() {
    // Get all image in editor
    var imageElement = $('#editor img');
    if (imageElement) {
        for (var i = 0; i < imageElement.length; i++) {
            arrImageBase64.push($(imageElement[i]).attr('src'));
        }
    }
    console.log("arrImageBase64", arrImageBase64);
    return arrImageBase64;
}

function setUrlImage(imageUrl) {
    let range = quill.getSelection();
    quill.insertEmbed(
        range.index,
        "image",
        imageUrl
    );
}

function showToolbar(isShow) {
    if (isShow) {
        $("#editor").prop("readonly", false);
        $('#custom-toolbar').show();
    } else {
        $("#editor").prop("readonly", true);
        $('#custom-toolbar').hide();
    }
}

function convertImageToBase64(file) {
    // create a new FileReader to read this image and convert to base64 format
    var reader = new FileReader();
    // Define a callback function to run, when FileReader finishes its job
    reader.onload = e => {
        // Read image as base64 and set to imageData
        let range = quill.getSelection();
        imageBase64 = e.target.result;
        quill.insertEmbed(
            range.index,
            "image",
            imageBase64
        );
    }
    // Start the reader job - read file as a data url (base64 format)
    reader.readAsDataURL(file);
}

var textSize = ['14px', '16px'];
var option = true;

function clickSizeIcon() {
    var element = $('#icon-text-size');
    changeIconAfterClick(element);
    option = !option;
    if (option) {
        quill.format('size', false);
    } else {
        quill.format('size', 'large');
    }
}

function clickListIcon() {
    var element = $('#icon-list');
    changeIconAfterClick(element);
    $("button.ql-list").click()
}

function clickQuoteIcon() {
    var element = $('#icon-quote');
    changeIconAfterClick(element);
    $("button.ql-blockquote").click()
}

function clickDivisionIcon() {
    $("button.ql-clean").click()
}

function clickImageIcon() {
    $("button.ql-image").click()
}

function changeIconAfterClick(element) {
    var src = element.attr('src');
    if (src.indexOf('blue') > 0) {
        element.attr('src', src.replace('blue', 'gray'));
    } else {
        element.attr('src', src.replace('gray', 'blue'));
    }
}

function changeIcon(element, isBlue) {
    var src = element.attr('src');
    if (isBlue) {
        element.attr('src', src.replace('gray', 'blue'));
    } else {
        element.attr('src', src.replace('blue', 'gray'));
    }
}

function resetIconButton() {
    changeIcon($('#icon-text-size'), false);
    changeIcon($('#icon-list'), false);
    changeIcon($('#icon-quote'), false);
}

function changeButtonIcon(format, text) {
    if (format) {
        resetIconButton();
        var size = format.size;
        var list = format.list;
        var blockquote = format.blockquote;
        if (size) {
            changeIcon($('#icon-text-size'), true);
        }
        if (list) {
            changeIcon($('#icon-list'), true);
        }
        if (blockquote) {
            changeIcon($('#icon-quote'), true);
        }
    }
}