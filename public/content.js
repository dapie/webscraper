/*global chrome*/
let tabID, resArr, selected = [], dom, parent, firstElement;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("CONTENT:"+request)
        if( request.message === "start" ) {
            parent = request.parent
            start(request.body);
            tabID = sender.id
            chrome.runtime.sendMessage({message: "icon", options: { 
                text: "^", 
                select: request.body
            }});
        } else if( request.message === "show" ) {
            chrome.runtime.sendMessage({message: "icon", options: { 
                text: "^", 
                select: false
            }});
            if(request.body.viewSelected){
                resArr = request.body.arr
                selectElements()
            } else {
                clearSelected()
            }
            tabID = sender.id
        }
    }
);

function start(startSelect){
    clearSelected();
    if(startSelect){
        if(parent){
            console.log(parent)
            firstElement = getFirstElement()
            console.log(firstElement)
        }
        document.onmouseover = (event) => {
            event.stopPropagation();
            if(parent && !firstElement.contains(event.target)) return;
            event.target.classList.add('hint-mode_show-block');
        }
        document.onmouseout = (event) => {
            event.stopPropagation();
            if(parent && !firstElement.contains(event.target)) return;
            event.target.classList.remove('hint-mode_show-block');
        }
        document.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            if(parent && !firstElement.contains(event.target)) return;
            event.target.classList.remove('hint-mode_show-block');
            addSelectedElement(event.target);
        }
    } else {
        chrome.runtime.sendMessage(tabID, {resArr: JSON.stringify(resArr)});
        document.onmouseover = undefined
        document.onmouseout = undefined
        document.onclick = undefined
        parent = undefined
    }
}

function addSelectedElement(target){
    for(let i = 0; i < selected.length; i++){
        if(selected[i] === target){
            selected[i].classList.remove('selected-mode_show-block')
            selected.splice(i, 1)
            checkElements()
            return;
        }
    }
    target.classList.add('selected-mode_show-block')
    selected.push(target)
    checkElements()
}

function checkInSelected(el){
    for(let i = 0; i < selected.length; i++){
        if(selected[i] === el){
            return true
        }
    }
    return false
}

function clearSelected(){
    dom = document.body.getElementsByTagName("*");
    selected = [];
    for(let i = 0; i < dom.length; i++){
        dom[i].classList.remove('check-mode_show-block');
        dom[i].classList.remove('check2-mode_show-block');
        dom[i].classList.remove('selected-mode_show-block');
    }
    return false
}

function getParams(el){
    const isSelected = checkInSelected(el)
    if(isSelected) el.classList.remove('selected-mode_show-block')
    el.classList.remove('check-mode_show-block')
    el.classList.remove('check2-mode_show-block');
    const params = {
        localName: el.localName,
        id: el.id,
        class: el.classList ? el.classList.value : "",
        childCount: el.children.length,
        parentNodeClass: el.parentNode && el.parentNode.classList ? el.parentNode.classList.value : undefined,
        parentNodeLocalName: el.parentNode ? el.parentNode.localName : undefined,
        parentNodeId: el.parentNode ? el.parentNode.id : undefined,
    }
    if(isSelected) el.classList.add('selected-mode_show-block')
    return params
}

function checkElements(){
    resArr = getParams(selected[0])

    for(let i = 1; i < selected.length; i++){
        for(let param in resArr){
            if(resArr[param] !== getParams(selected[i])[param]) delete resArr[param]
        }
    }
    selectElements()
}

function selectElements(){
    dom = parent ? getFirstElement().getElementsByTagName("*") : document.body.getElementsByTagName("*");
    let flag = true;
    for(let i = 0; i < dom.length; i++){
        let elemParams = getParams(dom[i])
        flag = true
        for(let p in resArr){
            if(resArr[p] !== elemParams[p]){
                flag = false
                break
            } 
        }
        if(flag) dom[i].classList.add(parent ? 'check2-mode_show-block' : 'check-mode_show-block')
    }
}

function getFirstElement(){
    let parArr = parent.selectArr
    dom = document.body.getElementsByTagName("*");
    let firstElement
    let flag = true
    for(let i = 0; i < dom.length; i++){
        let elemParams = getParams(dom[i])
        flag = true
        for(let p in parArr){
            if(parArr[p] !== elemParams[p]){
                flag = false
                break
            } 
        }
        if(flag){
            firstElement = dom[i]
            dom[i].classList.add('check-mode_show-block')
            break;
        }
    }
    return firstElement
}