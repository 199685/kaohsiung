let data
let len
let xhr = new XMLHttpRequest
xhr.open('GET', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true)
xhr.send(null)
xhr.onload = function() {
    data = JSON.parse(xhr.responseText).result.records
    len = data.length
}

window.onload = function() {

    const select = document.querySelector('#area')
    const content = document.querySelector('.areadata')
    const hotarea = document.querySelector('.select')
    const pageNumberID = document.getElementById('pagenumber')
    const topicon = document.querySelector('.btn')
    let thisPage = 0
    let removeStyle = 1
    let newData = []
    addSelect()

    //add選單選項
    function addSelect() {
        var str = searchData(select.value)
        var selectData = '<option value="請選擇">--請選擇行政區--</option>'
        for (let i = 0; i < str[0]; i++) {
            selectData += '<option value="' + str[1][i] + '">' + str[1][i] + '</option>'
        }
        select.innerHTML = selectData
        content.previousSibling.previousSibling.textContent = 'All'
    }

    hotarea.addEventListener('click', function(e) {
        if (e.target.nodeName == 'A') {
            searchData(e.target.textContent)
        }

    }, false)

    select.addEventListener('change', function(e) {
        searchData(e.target.value)
    }, false)

    //search All data
    function searchData(name) {
        newData = []
        var str = []
        var name = name
        thisPage = 0
        removeStyle = 1
        for (let i = 0; i < len; i++) {
            if (data[i].Zone == name) {
                content.previousSibling.previousSibling.textContent = name
                newData.push(data[i])
            } else if (name == '請選擇' || name == '') {
                content.previousSibling.previousSibling.textContent = 'All'
                newData.push(data[i])
            }
            if (name == '' && str.indexOf(data[i].Zone) < 0) {
                str.push(data[i].Zone)
            }
        }
        printNewData()
        page()
        return [str.length, str]



    }

    // bottom page number 
    function page() {
        let printData = newData
        let printlen = printData.length
        let pageNumber = Math.ceil(printlen / 10)
        let pageStyle = pageNumberID.childNodes
        let eleStr = `<li class="prev">prev</li>`

        if (pageNumber > 1) {
            for (let i = 1; i <= pageNumber; i++) {
                eleStr += `<li data-num=" + ${i} + "> ${i}</li>`
            }
            eleStr += `<li class="next blue">next</li>`
            pageNumberID.innerHTML = eleStr
            pageStyle[1].classList.add('red')
        } else {
            pageNumberID.innerHTML = ''
        }

    }

    //change page style 
    function addStyle(e) {
        let pageStyle = pageNumberID.childNodes
        let pageStylelen = pageStyle.length
        let printData = newData
        let printlen = printData.length
        let pageNumber = Math.ceil(printlen / 10)
        let thisNumber = thisPage / 10
        if (e.target.nodeName == 'LI') {
            //prev style
            if (thisPage > 10) {
                pageStyle[0].classList.add('blue')
            } else {
                pageStyle[0].classList.remove('blue')
            }
            //next style
            if (thisNumber == pageNumber) {
                pageStyle[pageStylelen - 1].classList.remove('blue')
            } else {
                pageStyle[pageStylelen - 1].classList.add('blue')
            }
            //number style
            if (thisNumber !== pageStyle[removeStyle]) {
                pageStyle[removeStyle].classList.remove('red')
                pageStyle[1].classList.remove('red')
                pageStyle[thisNumber].classList.add('red')
                removeStyle = thisNumber
            }

        }
    }

    //print data 
    function printNewData(i, j) {
        let printData = newData
        let printlen = printData.length
        let eleStr = ''
        var i = i || 0
        var j = j || 10
        thisPage = j
        if (j > printlen) {
            j = printlen
            thisPage = Math.ceil(printlen / 10) * 10
        }
        for (; i < j; i++) {
            var addele = `
        <li class="item">

            <div class="img">
                <img src=${printData[i].Picture1} alt="">
                <div class="img-text">
                    <h3>${printData[i].Name}</h3>
                    <p>${printData[i].Zone}</p>
                </div>
            </div>

            <div class="contact">
                <p>${printData[i].Opentime}</p>
                <p>${printData[i].Add}</p>

                <div class="number">
                    <p>${printData[i].Tel}</p>
                    <p>${printData[i].Ticketinfo}</p>
                </div>
            </div>
        </li>`

            eleStr += addele
        }
        if (eleStr !== '') {
            content.innerHTML = eleStr
        }

    }

    pageNumberID.addEventListener('click', function(e) {
        var i = 0
        var j = 0
        if (e.target.dataset.num !== undefined) {
            j = 10 * e.target.textContent
            i = j - 10
            thisPage = j
        } else if (e.target.textContent == 'next') {
            if (thisPage == 0) {
                i = 10
                j = 20
            } else {
                i = thisPage
                j = thisPage + 10
            }
        } else if (e.target.textContent == 'prev') {
            if (thisPage > 10) {
                i = thisPage - 20
                j = thisPage - 10
                thisPage = j
            }
        }
        printNewData(i, j)
        addStyle(e)
    }, false)

    topicon.addEventListener('click', function(e) {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, false)
};