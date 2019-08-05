(function() {
    const regexPatternPhone = /((\+?\d{1,3}-[1-9]\d{0,3})|0[1-9]\d{0,3})-\d{1,4}-\d{1,4}/g;
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let observer = new MutationObserver(function(mutations) {
        Array.prototype.forEach.call(mutations, function(mutation) {
            if (mutation.type === 'childList') {
                Array.prototype.forEach.call(mutation.addedNodes, function(node) {
                    searchNodes(node)
                });
            }
        });
    });
    observer.observe(document, {
        childList: true,
        characterData: true,
        subtree: true
    });
    searchNodes(document.body);

    function searchNodes(rootNode){
        let search = function(node){
            while(node != null && node.parentElement.tagName !== "A"){
                if(node.classList != null){
                    if(node.classList.contains('createdByLinkManager')){ break; }
                }
                // 自分の中にあるテキストをリプレース
                let text = node.nodeValue;
                let matchingResult;
                if(text) {
                    matchingResult = text.match(regexPatternPhone);
                }
                if(matchingResult){
                    let newNode = document.createElement("span");
                    let textNodeContent;
                    let spanNode;
                    let linkNode;
                    let startIndex = 0;
                    let endIndex = 0;
                    let textLen = text.length;
                    let planeText;
                    for(let i = 0, len = matchingResult.length; i < len && startIndex < textLen; i++){
                        endIndex = text.indexOf(matchingResult[i]);
                        spanNode = document.createElement("span");
                        spanNode.classList.add('createdByLinkManager');
                        planeText = text.substring(startIndex, endIndex);
                        if(endIndex > 0){
                            textNodeContent = document.createTextNode(planeText);
                            spanNode.appendChild(textNodeContent);
                        }
                        linkNode = document.createElement("A");
                        linkNode.appendChild(document.createTextNode(matchingResult[i]));
                        // linkNode.href = "javascript:void(0)";
                        linkNode.href = 'tel:' + matchingResult[i];
                        spanNode.appendChild(linkNode);
                        newNode.appendChild(spanNode);
                        text = text.substring(endIndex + matchingResult[i].length);
                        startIndex = 0;
                    }
                    planeText = text;
                    textNodeContent = document.createTextNode(planeText);
                    spanNode.appendChild(textNodeContent);
                    newNode.appendChild(spanNode);
                    node.parentNode.replaceChild(newNode, node);
                    node = newNode;
                }
                // 子ノードを再帰
                search(node.firstChild);
                // 次のノードを探査
                node = node.nextSibling;
            }
        };
        search(rootNode.firstChild);
    }
})();