$(function () {
    var tplBegin = '<li id="gitIssue">' +
        '<a href="javascript:void(0)" aria-label="subscribe or unsubscribe the repo to GitIssue" class="btn btn-sm">' +
        '<img src="https://gitissue.com/public/logo/apple-icon.png" >';
    var tplEnd = '</a></li>';
    var loginUserName = $('meta[name="user-login"]').attr('content');
    var nameWithOwner = $('meta[name="octolytics-dimension-repository_nwo"]').attr('content');
    var isSubscribedUrl = 'https://gitissue.com/api/isSubscribed?loginUserName=' + loginUserName + '&nameWithOwner=' + encodeURIComponent(nameWithOwner);
    var subscribeUrl = 'https://gitissue.com/api/subscribe';

    var pageScript = document.createElement('script');
    pageScript.innerHTML = 'document.addEventListener("pjax:success", function () { var evt = new Event("PJAX_PUSH_STATE_GIT_ISSUE"); document.dispatchEvent(evt); });';
    document.querySelector('body').appendChild(pageScript);

    render();

    document.addEventListener('PJAX_PUSH_STATE_GIT_ISSUE', render);

    function render() {
        // TODO 私有仓库不能 watch, 
        // (暂时不处理，有用户提了再修复，这会导致所有的业务逻辑都要修改下，因为现在关注的仓库都应该是 public)?
        if (!$('.pagehead-actions').length) {
            return;
        }
        $.get(isSubscribedUrl, function (data) {
            if ($('#gitIssue').length) return;
            var tplMiddle = '';
            if (data.isSubscribed) {
                tplMiddle = '<span class="subscribe">Unsubscribe</span>';
            } else {
                tplMiddle = '<span class="subscribe">Subscribe</span>';
            }
            var tpl = tplBegin + tplMiddle + tplEnd;
            $('.pagehead-actions').prepend(tpl);
            // if (!data.success) {
            //     $('#gitIssue').tooltipster({
            //         content: data.message + '<a href="https://gitissue.com" target="_blank">GitIssue</a>',
            //         trigger: 'click',
            //         side: ['bottom'],
            //         maxWidth: 250,
            //         interactive: true,
            //         contentAsHTML: true
            //     });
            // }
        });
    }


    $(document).on('click', '#gitIssue', function (e) {
        $.post(subscribeUrl, {
            loginUserName: loginUserName,
            nameWithOwner: nameWithOwner
        }, function (data) {
            if (data.success) {
                if (data.isSubscribed) {
                    $('#gitIssue .subscribe').text('Unsubscribe');
                } else {
                    $('#gitIssue .subscribe').text('Subscribe');
                }
            } else {
                $('#gitIssue').tooltipster({
                    content: data.message ,
                    side: ['bottom'],
                    maxWidth: 250,
                    interactive: true,
                    contentAsHTML: true,
                    debug: false
                }).tooltipster('open');;
            }
        })
    })
});