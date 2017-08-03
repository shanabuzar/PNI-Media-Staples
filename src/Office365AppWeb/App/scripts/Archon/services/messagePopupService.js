(function() {
    'use strict';

    angular.module("Archon")
        .service("messagePopupService", [
            "$compile", "$document", "$rootScope", "$sce", "$q", function ($compile, $document, $rootScope, $sce, $q) {
                var element = null;
                var dialogResult = null;
                // clears the message element
                function hideMessage() {
                    if (element) {
                        element.remove();
                        element = null;
                    }
                }

                function okMessage() {
                    hideMessage();
                    dialogResult.resolve(true);
                }

                function cancelMessage() {
                    hideMessage();
                    dialogResult.resolve(false);
                }

                function showMessage(message, allowCancel) {
                    dialogResult = $q.defer();
                    if (element)
                        hideMessage();
                    var body = $document.find('body').eq(0);
                    var messageScope = $rootScope.$new(true);
                    messageScope.errorObj = {
                        show: true,
                        long: $sce.trustAsHtml(message),
                        allowCancel: !!allowCancel,
                        hide: okMessage,
                        cancel: cancelMessage
                    };

                    element = $compile("<pni-message-popup></pni-message-popup>")(messageScope);
                    body.append(element);
                    // remove focus from active element to avoid submits using keyboard
                    body.find(":focus").blur();
                    
                    return dialogResult.promise;
                }

                return { show: showMessage, hide: hideMessage };
            }
        ]);
})();