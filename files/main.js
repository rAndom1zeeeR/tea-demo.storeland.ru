// Форма поиска ( Сразу же помечаем объект поиска, как инициализированный, чтобы случайно не инициализировать его дважды.)
function SearchFieldInit(obj) {
  // Блок в котором лежит поле поиска
  obj.f_search = obj.find('.search__form');
  // Если поля поиска не нашлось, завершаем работу, ничего страшного.
  if(0 == obj.f_search.length) {
    return false;
  }
  // Поле поиска товара
  obj.s_search = obj.f_search.find('.search__input');
  // Обнуление данных в форме поиска
  obj.s_reset  = obj.f_search.find('.search__reset');
  // Проверка на существование функции проверки поля и действий с ним
  if(typeof(obj.SearchFieldCheck) != 'function') {
    console.log('function SearchFieldCheck is not found in object for SearchFieldInit', {status: 'error'});
    return false;
  // Проверка, сколько полей поиска нам подсунули за раз на инициализацию
  } else if(1 < obj.f_search.length) {
    console.log('function SearchFieldInit must have only one search object', {status: 'error'});
    return false;
  }
  // Создаём функцию которая будет отвечать за основные действия с полем поиска
  obj.__SearchFieldCheck = function (isAfter) {
    // Если в поле текста есть вбитые данные
    if(obj.s_search.val().length) {
      obj.f_search.addClass('search__filled');
      obj.f_search.parent().addClass('search__filled');
    } else {
      obj.f_search.removeClass('search__filled');
      obj.f_search.parent().removeClass('search__filled');
    }
    // При нажатии клавиши данных внутри поля ещё нет, так что проверки вернут информацию что менять поле не нужно, хотя как только операция будет завершена данные в поле появятся. Поэтому произведём вторую проверку спустя 2 сотых секунды.
    if(typeof( isAfter ) == "undefined" || !isAfter) {
      setTimeout(function() { obj.__SearchFieldCheck(1); },20);
    }else{
      return obj.SearchFieldCheck();
    }
  }
  // Действия с инпут полем поиска
  obj.s_search.click(function(){
    obj.__SearchFieldCheck();
  }).focus(function(){
    obj.f_search.addClass('search__focused');
    obj.f_search.parent().addClass('search__focused');
    obj.__SearchFieldCheck();
  }).blur(function(){
    obj.f_search.removeClass('search__focused');
    obj.f_search.parent().removeClass('search__focused');
    obj.__SearchFieldCheck();
  }).keyup(function(I){
    switch(I.keyCode) {
      // игнорируем нажатия на эти клавишы
      case 13:  // enter
      case 27:  // escape
      case 38:  // стрелка вверх
      case 40:  // стрелка вниз
      break;
      default:
      obj.f_search.removeClass('search__focused');
      obj.__SearchFieldCheck();
      break;
    }
  }).bind('paste', function(e){
    obj.__SearchFieldCheck();
    setTimeout(function() { obj.__SearchFieldCheck(); },20);
  }).bind('cut', function(e){
    $('#search__result').hide();
    $('#search__result .inner > div').remove();
    obj.__SearchFieldCheck();
  });

  //Считываем нажатие клавиш, уже после вывода подсказки
  var suggestCount;
  var suggestSelected = 0;
  function keyActivate(n){
    var $links = $('#search__result .result__item a');
    $links.eq(suggestSelected-1).removeClass('active');	
    if(n == 1 && suggestSelected < suggestCount){
      suggestSelected++;
    }else if(n == -1 && suggestSelected > 0){
      suggestSelected--;
    }
    if( suggestSelected > 0){
      $links.eq(suggestSelected-1).addClass('active');
    }
  }
  obj.s_search.keydown(function(I){
    switch(I.keyCode) {
    // По нажатию клавиш прячем подсказку
    case 27: // escape
    $('#search__result').hide();
    return false;
    break;
    // Нажатие enter при выделенном пункте из поиска
    case 13: // enter
    if(suggestSelected){
      var $link = $('#search__result .result__item').eq(suggestSelected - 1).find('a');
      var href = $link.attr('href');
      if(href){
        document.location = href
      } else {
        $link.trigger('click')
      }
      return false;
    }
    break;
    // делаем переход по подсказке стрелочками клавиатуры
    case 38: // стрелка вверх
    case 40: // стрелка вниз
    I.preventDefault();
    suggestCount = $('#search__result .result__item').length
    if(suggestCount){
      //делаем выделение пунктов в слое, переход по стрелочкам
      keyActivate(I.keyCode-39);
    }
    break;
    default:
    suggestSelected = 0;
    break;
    }
  });
  // Кнопка обнуления данных в форме поиска
  obj.s_reset.click(function(){
    obj.s_search.val('').focus();
    $('#search__result').hide();
    $('#search__result .inner .result__item').remove();
  });
  // Проверка данных в форме после инициализации функционала. Возможно браузер вставил туда какой-либо текст, нужно обработать и такой вариант
  obj.__SearchFieldCheck();
}

// Аналог php функции.
function htmlspecialchars(text) {
  return text
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");
}
function substr(str,start,len){str+='';var end=str.length;if(start<0){start+=end;}end=typeof len==='undefined'?end:(len<0?len+end:len+start);return start>=str.length||start<0||start>end?!1:str.slice(start,end);}
function md5(str){var xl;var rotateLeft=function(lValue,iShiftBits){return(lValue<<iShiftBits)|(lValue>>>(32-iShiftBits));};var addUnsigned=function(lX,lY){var lX4,lY4,lX8,lY8,lResult;lX8=(lX&0x80000000);lY8=(lY&0x80000000);lX4=(lX&0x40000000);lY4=(lY&0x40000000);lResult=(lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);if(lX4&lY4){return(lResult^0x80000000^lX8^lY8);}
if(lX4|lY4){if(lResult&0x40000000){return(lResult^0xC0000000^lX8^lY8);}else{return(lResult^0x40000000^lX8^lY8);}}else{return(lResult^lX8^lY8);}};var _F=function(x,y,z){return(x&y)|((~x)&z);};var _G=function(x,y,z){return(x&z)|(y&(~z));};var _H=function(x,y,z){return(x^y^z);};var _I=function(x,y,z){return(y^(x|(~z)));};var _FF=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_F(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _GG=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_G(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _HH=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_H(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _II=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_I(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var convertToWordArray=function(str){var lWordCount;var lMessageLength=str.length;var lNumberOfWords_temp1=lMessageLength+8;var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1%64))/64;var lNumberOfWords=(lNumberOfWords_temp2+1)*16;var lWordArray=new Array(lNumberOfWords-1);var lBytePosition=0;var lByteCount=0;while(lByteCount<lMessageLength){lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=(lWordArray[lWordCount]|(str.charCodeAt(lByteCount)<<lBytePosition));lByteCount++;}
lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=lWordArray[lWordCount]|(0x80<<lBytePosition);lWordArray[lNumberOfWords-2]=lMessageLength<<3;lWordArray[lNumberOfWords-1]=lMessageLength>>>29;return lWordArray;};var wordToHex=function(lValue){var wordToHexValue="",wordToHexValue_temp="",lByte,lCount;for(lCount=0;lCount<=3;lCount++){lByte=(lValue>>>(lCount*8))&255;wordToHexValue_temp="0"+lByte.toString(16);wordToHexValue=wordToHexValue+wordToHexValue_temp.substr(wordToHexValue_temp.length-2,2);}
return wordToHexValue;};var x=[],k,AA,BB,CC,DD,a,b,c,d,S11=7,S12=12,S13=17,S14=22,S21=5,S22=9,S23=14,S24=20,S31=4,S32=11,S33=16,S34=23,S41=6,S42=10,S43=15,S44=21;str=this.utf8_encode(str);x=convertToWordArray(str);a=0x67452301;b=0xEFCDAB89;c=0x98BADCFE;d=0x10325476;xl=x.length;for(k=0;k<xl;k+=16){AA=a;BB=b;CC=c;DD=d;a=_FF(a,b,c,d,x[k+0],S11,0xD76AA478);d=_FF(d,a,b,c,x[k+1],S12,0xE8C7B756);c=_FF(c,d,a,b,x[k+2],S13,0x242070DB);b=_FF(b,c,d,a,x[k+3],S14,0xC1BDCEEE);a=_FF(a,b,c,d,x[k+4],S11,0xF57C0FAF);d=_FF(d,a,b,c,x[k+5],S12,0x4787C62A);c=_FF(c,d,a,b,x[k+6],S13,0xA8304613);b=_FF(b,c,d,a,x[k+7],S14,0xFD469501);a=_FF(a,b,c,d,x[k+8],S11,0x698098D8);d=_FF(d,a,b,c,x[k+9],S12,0x8B44F7AF);c=_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);b=_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);a=_FF(a,b,c,d,x[k+12],S11,0x6B901122);d=_FF(d,a,b,c,x[k+13],S12,0xFD987193);c=_FF(c,d,a,b,x[k+14],S13,0xA679438E);b=_FF(b,c,d,a,x[k+15],S14,0x49B40821);a=_GG(a,b,c,d,x[k+1],S21,0xF61E2562);d=_GG(d,a,b,c,x[k+6],S22,0xC040B340);c=_GG(c,d,a,b,x[k+11],S23,0x265E5A51);b=_GG(b,c,d,a,x[k+0],S24,0xE9B6C7AA);a=_GG(a,b,c,d,x[k+5],S21,0xD62F105D);d=_GG(d,a,b,c,x[k+10],S22,0x2441453);c=_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);b=_GG(b,c,d,a,x[k+4],S24,0xE7D3FBC8);a=_GG(a,b,c,d,x[k+9],S21,0x21E1CDE6);d=_GG(d,a,b,c,x[k+14],S22,0xC33707D6);c=_GG(c,d,a,b,x[k+3],S23,0xF4D50D87);b=_GG(b,c,d,a,x[k+8],S24,0x455A14ED);a=_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);d=_GG(d,a,b,c,x[k+2],S22,0xFCEFA3F8);c=_GG(c,d,a,b,x[k+7],S23,0x676F02D9);b=_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);a=_HH(a,b,c,d,x[k+5],S31,0xFFFA3942);d=_HH(d,a,b,c,x[k+8],S32,0x8771F681);c=_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);b=_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);a=_HH(a,b,c,d,x[k+1],S31,0xA4BEEA44);d=_HH(d,a,b,c,x[k+4],S32,0x4BDECFA9);c=_HH(c,d,a,b,x[k+7],S33,0xF6BB4B60);b=_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);a=_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);d=_HH(d,a,b,c,x[k+0],S32,0xEAA127FA);c=_HH(c,d,a,b,x[k+3],S33,0xD4EF3085);b=_HH(b,c,d,a,x[k+6],S34,0x4881D05);a=_HH(a,b,c,d,x[k+9],S31,0xD9D4D039);d=_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);c=_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);b=_HH(b,c,d,a,x[k+2],S34,0xC4AC5665);a=_II(a,b,c,d,x[k+0],S41,0xF4292244);d=_II(d,a,b,c,x[k+7],S42,0x432AFF97);c=_II(c,d,a,b,x[k+14],S43,0xAB9423A7);b=_II(b,c,d,a,x[k+5],S44,0xFC93A039);a=_II(a,b,c,d,x[k+12],S41,0x655B59C3);d=_II(d,a,b,c,x[k+3],S42,0x8F0CCC92);c=_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);b=_II(b,c,d,a,x[k+1],S44,0x85845DD1);a=_II(a,b,c,d,x[k+8],S41,0x6FA87E4F);d=_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);c=_II(c,d,a,b,x[k+6],S43,0xA3014314);b=_II(b,c,d,a,x[k+13],S44,0x4E0811A1);a=_II(a,b,c,d,x[k+4],S41,0xF7537E82);d=_II(d,a,b,c,x[k+11],S42,0xBD3AF235);c=_II(c,d,a,b,x[k+2],S43,0x2AD7D2BB);b=_II(b,c,d,a,x[k+9],S44,0xEB86D391);a=addUnsigned(a,AA);b=addUnsigned(b,BB);c=addUnsigned(c,CC);d=addUnsigned(d,DD);}
var temp=wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d);return temp.toLowerCase();}
function utf8_encode(argString){var string=(argString+'');var utftext="";var start,end;var stringl=0;start=end=0;stringl=string.length;for(var n=0;n<stringl;n++){var c1=string.charCodeAt(n);var enc=null;if(c1<128){end++;}else if(c1>127&&c1<2048){enc=String.fromCharCode((c1>>6)|192)+String.fromCharCode((c1&63)|128);}else{enc=String.fromCharCode((c1>>12)|224)+String.fromCharCode(((c1>>6)&63)|128)+String.fromCharCode((c1&63)|128);}
if(enc!==null){if(end>start){utftext+=string.substring(start,end);}
utftext+=enc;start=end=n+1;}}
if(end>start){utftext+=string.substring(start,string.length);}
return utftext;}
function rand(min,max){var argc=arguments.length;if(argc===0){min=0;max=2147483647;}else if(argc===1){throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');}return Math.floor(Math.random()*(max-min+1))+min;}
// Получить md5 хэш
function GenMd5Hash () {
return substr(md5(parseInt(new Date().getTime() / 1000, 10)),rand(0,24),8);
}

// Живой поиск
$(function() {
  // Навигационная таблица над таблицей с данными
  var searchBlock = $('.search');
  var options = {
    target: 'form.store_ajax_catalog',
    url:  '/admin/store_catalog',
    items_target: '#goods',
    last_search_query:  '',
  };
  // По этому хэшу будем обращаться к объекту извне
  var randHash = GenMd5Hash();
  // Если объекта со списком ajax функций не существует, создаём её
  if(typeof(document.SearchInCatalogAjaxQuerySender) == 'undefined') {
  document.SearchInCatalogAjaxQuerySender = {};
  }
  // Поле поиска обновилось, внутри него можно выполнять любые действия
  searchBlock.SearchFieldCheck = function () {
    // Отменяем выполнение последнего запущенного через таймаут скрипта, если таковой был.
    if(typeof(document.lastTimeoutId) != 'undefined') {
      clearTimeout(document.lastTimeoutId);
    }
    document.lastTimeoutId = setTimeout("document.SearchInCatalogAjaxQuerySender['" + randHash + "']('" + htmlspecialchars(searchBlock.s_search.val()) + "');", 300);
  }
  // Отправляет запрос к серверу с задачей поиска товаров
  document.SearchInCatalogAjaxQuerySender[randHash] = function (old_val) {
    var last_search_query_array = [];
    // sessionStorage is available
    if (typeof sessionStorage !== 'undefined') {
      try {
        if(sessionStorage.getItem('lastSearchQueryArray')){
        last_search_query_array = JSON.parse(sessionStorage.getItem('lastSearchQueryArray'));
        // Находим соответствие текущего запроса с sessionStorage
        var currentSearch = $.grep(last_search_query_array, function (item){
          return item.search_query == old_val
        })[0]
        if(currentSearch){
          showDropdownSearch(JSON.parse(currentSearch.content));
          return;
        }
        }else{
        sessionStorage.setItem('lastSearchQueryArray', '[]')
        }
      }catch(e) {
      // sessionStorage is disabled
      }
    }
    // Если текущее значение не изменилось спустя 300 сотых секунды и это значение не то по которому мы искали товары при последнем запросе
    if(htmlspecialchars(searchBlock.s_search.val()) == old_val && searchBlock.s_search.val().length > 1) {
      // Запоминаем этот запрос, который мы ищем, чтобы не произвводить повторного поиска
      options['last_search_query'] = old_val;
      // Добавляем нашей форме поиска поле загрузки
      searchBlock.f_search.addClass('search__loading');
      // Собираем параметры для Ajax запроса
      var params = {
        'ajax_q'                : 1,
        'goods_search_field_id' : 0,
        'q'                     : options['last_search_query'],
      },
      // Объект со значением которого будем в последствии проверять полученные от сервера данные
      search_field_obj = searchBlock.s_search;
      // Аяксом отправляем запрос на поиск нужных товаров и категорий
      $.ajax({
      type: "POST",
      cache: false,
      url: searchBlock.f_search.attr('action'),
      data: params,
      dataType: 'json',
      success: function(data) {
      // Если набранный запрос не соответствует полученным данным, видимо запрос пришёл не вовремя, отменяем его.
      if(search_field_obj.val() != old_val) {
        return false;
      }
      // Записываем в sessionStorage
      if (typeof sessionStorage !== 'undefined') {
        try {
          sessionStorage.setItem('lastSearchQueryArray', JSON.stringify(last_search_query_array))
          // Находим соответствие текущего запроса с sessionStorage
          var currentSearch = $.grep(last_search_query_array, function (item){
            return item.search_query == old_val
          })[0]
          //Если такого запроса ещё не было запишем его в sessionStorage
          if(typeof currentSearch == 'undefined'){
            // Добавляем в массив последних запросов данные по текущему запросу
            last_search_query_array.push({
              search_query: old_val,
              content: JSON.stringify(data)
            })
            sessionStorage.setItem('lastSearchQueryArray', JSON.stringify(last_search_query_array))
          }
        }catch(e){
        // sessionStorage is disabled
        }
      }
      // Показываем результаты на основе пришедших данных
      showDropdownSearch(data);
      // Убираем информацию о том что запрос грузится.
      searchBlock.f_search.removeClass("search__loading");
      }
      });
    }else{
      $("#search__result").hide();
    }
    function showDropdownSearch(data){
      // Отображение категорий в поиске
      if(data.category.length!=undefined && data.category.length>0){
        $(".result__category .result__item").remove();
        $("#search__result").hide();
        for(с=0; с < data.category.length; с++){
          // Проверка наличия изображения
          if (data.category[с].image_icon == null) {
            data.category[с].image_icon = '/design/no-photo-icon.png'
          } else {
            data.category[с].image_icon = data.category[с].image_icon;
          }
          // Отображаем результат поиска
          $("#search__result .result__category").append('<div class="result__item" data-id="'+ data.category[с].goods_cat_id +'"><a href="'+ data.category[с].url +'"><div class="result__image"><img src="'+ data.category[с].image_icon +'" class="goods-image-icon" /></div><div class="result__name"><span>'+ data.category[с].goods_cat_name +'</span></div></a></div>');
        }
      }else{
        $(".result__category .result__item").remove();
        $("#search__result").hide();
      }
      // Отображение товаров в поиске
      if(data.goods.length!=undefined && data.goods.length>0){
        $(".result__goods .result__item").remove();
        $("#search__result").hide();
        for(i=0; i < data.goods.length; i++){
          // Проверка наличия изображения
          if (data.goods[i].image_icon == null) {
            data.goods[i].image_icon = '/design/no-photo-icon.png'
          } else {
            data.goods[i].image_icon = data.goods[i].image_icon;
          }
          // Отображаем результат поиска
          if(i <= 4 ){
            $("#search__result .result__goods").append('<div class="result__item" data-id="'+ data.goods[i].goods_id +'"><a href="'+ data.goods[i].url +'"><div class="result__image"><img src="'+ data.goods[i].image_icon +'" class="goods-image-icon" /></div><div class="result__name"><span>'+ data.goods[i].goods_name +'</span></div></a></div>');
          }
          // Если последняя итерация цикла вставим кнопку "показать все"
          if(i > 4){
            $('.result__showAll').show();
          }
        }
      }else{
        $(".result__goods .result__item").remove();
        $("#search__result").hide();
      }
      // Скрываем результаты поиска если ничего не найдено
      if((data.category.length + data.goods.length) > 0){
        $("#search__result").show();
      }else{
        $("#search__result").hide();
      }
      
      if((data.category.length) > 0){
        $(".result__category").show();
      }else{
        $(".result__category").hide();
      }
      
      if((data.goods.length) > 0){
        $(".result__goods").show();
      }else{
        $(".result__goods").hide();
      }
      // Убираем информацию о том что запрос грузится.
      searchBlock.f_search.removeClass("search__loading");
    }
  }
  SearchFieldInit(searchBlock);
  $('.result__showAll').on('click', function(){
    $('.search__form').submit();
  });
});



// Возвращает правильное окончание для слова
function genWordEnd(num, e, m, mm) {
  // Если забыли указать окончания
  if(typeof (e) == "undefined") { e = ''; }
  if(typeof (m) == "undefined") { e = 'а'; }
  if(typeof (mm) == "undefined"){ e = 'oв'; }
  // Если передали пустую строку, вместо цифры
  if(0 == num.length) { num = 0; }
  // Превращаем цифру в правильный INT
  num = GetSum(num).toString();
  // Получаем последний символ цифры
  ch1 = num.substring(num.length-1);
  // Получаем последний символ цифры
  ch2 = num.length == 1 ? 0 : num.substring(num.length-2, num.length-1);
  // Если последняя цифра - 1, вернем единственное число
  if(ch2!=1 && ch1==1)               {return e;}
  // Если последняя цифра - от 2 до 4х , вернем множественное чило из массива с индексом 2
  else if(ch2!=1 && ch1>1 && ch1<=4) {return m;}
  // Если последняя цифра - от 5 до 0 , вернем множественное чило из массива с индексом 3
  else if(ch2==1 || ch1>4 || ch1==0) {return mm;}
}

// Считает сумму  33 599,65 + 2000 - 1910-41,6
function GetSum(val,precision) {
  if(typeof (precision) == "undefined" || precision < 0) { precision = 0; }
  // Возводим в степень точности 10 для округления
  var p = Math.pow(10,precision);  
  try {return Math.round(parseFloat(eval(val.toString().replace(/\s/gi, "").replace(/,/gi, ".")))*p)/p;} catch (e) {return 0;}
}

// Форматирует цену
function number_format(n,e,t,r){var i=n,a=e,o=function(n,e){var t=Math.pow(10,e);return(Math.round(n*t)/t).toString()};i=isFinite(+i)?+i:0,a=isFinite(+a)?Math.abs(a):0;var u,d,f="undefined"==typeof r?",":r,h="undefined"==typeof t?".":t,l=a>0?o(i,a):o(Math.round(i),a),s=o(Math.abs(i),a);s>=1e3?(u=s.split(/\D/),d=u[0].length%3||3,u[0]=l.slice(0,d+(0>i))+u[0].slice(d).replace(/(\d{3})/g,f+"$1"),l=u.join(h)):l=l.replace(".",h);var c=l.indexOf(h);return a>=1&&-1!==c&&l.length-c-1<a?l+=new Array(a-(l.length-c-1)).join(0)+"0":a>=1&&-1===c&&(l+=h+new Array(a).join(0)+"0"),l}

// Проверка вводимых значений в количестве товара
function keyPress(oToCheckField, oKeyEvent) {
  return oKeyEvent.charCode === 0 || /\d/.test(String.fromCharCode(oKeyEvent.charCode));
}

// Функция определения ширины экрана пользователя
function getClientWidth() {return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;}

// Работа с cookie файлами. 
// Получение переменной из cookie
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Установка переменной в cookie
function setCookie(name, value, options) {
  options = options || {};
  var expires = options.expires;
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires*1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) { 
    options.expires = expires.toUTCString();
  }
  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;
  for(var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];    
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

// Удаление переменной из cookie
function deleteCookie(name, options ) {
  options = options || {};
  options.expires = -1;
  setCookie(name, "", options)
}

// Отправляет ошибку на сервер, для того чтобы служба тех поддержки могла разобраться в проблеме как можно быстрее.
function sendError (desc, page, line) {
  var img=document.createElement('img');
  img.src = 'https://storeland.ru/error/js?desc='+encodeURIComponent(desc)+'&page='+encodeURIComponent(window.location)+'&line=0';
  img.style.position = 'absolute';
  img.style.top = '-9999px';
  try { document.getElementsByTagName('head').appendChild(img) } catch (e){}
  return false;
}

// Превращает поле пароля в текстовое поле и обратно
// @LinkObject - ссылка по которой кликнули
// @InputObject - объект у которого нужно изменить тип поля
function ChangePasswordFieldType (LinkObject, InputObject) {
  var 
    // Ссылка по которой кликнули
    LObject = $(LinkObject),
    // Объект у которого изменяем тип с password на text
    IObject = $(InputObject),
    // Старый текст ссылки
    txtOld = LObject.text(),
    // Новый текст ссылки
    txtNew = LObject.attr('rel');
  // Если объекты не получены, завершим работу функции
  if( LObject.length==0 || IObject.length==0 ) {
    return false;
  }
  // Изменяем у ссылки текст со старого на новый
  LObject.html(txtNew);
  // Старый текст ссылки сохраняем в атрибуте rel 
  LObject.attr('rel', txtOld);
  // Изменяем тип input поля
  if(IObject[0].type == 'text') {
    IObject[0].type = 'password';
  } else {
    IObject[0].type = 'text';
  }
}

// Крутит изображение при обновлении картинки защиты от роботов
function RefreshImageAction(img,num,cnt) {
  if(cnt>13) { return false; }
  $(img).attr('src', $(img).attr('rel') + 'icon/refresh/' + num + '.gif');
  num = (num==6)?0:num;
  setTimeout(function(){RefreshImageAction(img, num+1, cnt+1);}, 50);
}

// Функция определения браузера
$(document).ready(function() {
  var ua = detect.parse(navigator.userAgent);
  if (ua.browser.family === 'Safari') {
    $('body').addClass('Safari');
  }
  if (ua.browser.family === 'IE') {
    $('body').addClass('IE');
  }
  if (ua.browser.family === 'Edge') {
    $('body').addClass('Edge');
  }
  if (ua.browser.family === 'Firefox') {
    $('body').addClass('Firefox');
  }
  if (ua.browser.family === 'Opera') {
    $('body').addClass('Opera');
  }
  if (ua.browser.family === 'Chrome') {
    $('body').addClass('Chrome');
  }
  if (ua.os.family === 'iOS') {
    $('body').addClass('iOS');
  }
  if (ua.os.family === 'Android') {
    $('body').addClass('Android');
  }
});

// Наверх
$(document).ready(function(){
  $(".toTop").hide();
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('.toTop').fadeIn();
		} else {
			$('.toTop').fadeOut();
		}
	});
	$('.toTop').click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});
});

// Показать пароль 
function showPass() {
  $('.showPass').click(function(){
    ChangePasswordFieldType(this, $('#sites_client_pass'));
    ChangePasswordFieldType(this, $('.sites_client_pass'));
    if ($(this).closest('.showPassBlock').hasClass('active')) {
			$(this).closest('.showPassBlock').removeClass('active');
		} else {
			$(this).closest('.showPassBlock').addClass('active');
    }
    return false;
  });
}

// Предзагрузчик
function preload() {
  var preloader = $('.preloader');
  var spinner = preloader.find('.loading');
  spinner.fadeOut();
  preloader.delay(500).fadeOut('slow');
}

// Товар. Карточка товара
function goodspage() {
  // Слайдер доп. изображений
  $('.thumblist .owl-carousel').owlCarousel({
    items: 4,
    margin: 16,
    loop: false,
    rewind: true,
    lazyLoad: true,
    dots: false,
    nav: true,
    navText: [ , ],
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:2},
      320:{items:2},
      480:{items:3},
      641:{items:4},
      768:{items:5},
      992:{items:3},
      1200:{items:4},
      1400:{items:4}
    }
  });
  
  // Сопутствующие товары Слайдер
  $('.related__goods .owl-carousel').owlCarousel({
    items: 4,
    margin: 32,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    navContainer: '.related__goods .owl-nav',
    navText: [ , ],
    dots: false,
    autoHeight: true,
    autoHeightClass: 'owl-height',
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:1},
      320:{items:1, margin: 16},
      481:{items:2, margin: 16},
      641:{items:2},
      768:{items:3},
      992:{items:3},
      1200:{items:4}
    }
  });
  // С этим товаром смотрят Слайдер
  $('.related__views .owl-carousel').owlCarousel({
    items: 4,
    margin: 32,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    navContainer: '.related__views .owl-nav',
    navText: [ , ],
    dots: false,
    autoHeight: true,
    autoHeightClass: 'owl-height',
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:1},
      320:{items:1, margin: 16},
      481:{items:2, margin: 16},
      641:{items:2},
      768:{items:3},
      992:{items:3},
      1200:{items:4}
    }
  });
  
  // Переключение для Положительный и Отрицательный отзыв
  $('.generally label').on('click', function(event){
    event.preventDefault();
    $('.generally label').removeClass('active');
    $('.generally input').attr('checked', false);
    $(this).addClass('active');
    $(this).next('input').attr('checked', true);
  });
  // Ссылка на отображение формы для добавление отзыва о товаре
  $('.opinion__add').on('click', function(event){
    event.preventDefault();
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
      $('.opinion__addForm').slideUp(600);
    }else{
      $(this).addClass('active');
      $('.opinion__addForm').slideDown(600);
      $('html, body').animate({scrollTop : jQuery('.opinion__addForm').offset().top}, 500);
    }
  });
  // Добавление отзыва о товаре. Рейтинг
  $('.goodsOpinionRating').rating();
  // Валидация формы на странице оформления заказа, а так же формы на страницы связи с администрацией
  $(".opinion__form .button").on('click', function(){
    var form = $(".opinion__form");
    form.validate({
      errorPlacement: function(error, element) { }
    });
    form.submit();
    return false;      
  });
  // Иконка для обновления изображение капчи
  $('.captcha__refresh').click(function(){
    RefreshImageAction(this,1,1);
    $('.captcha__image').attr('src',$('.captcha__image').attr('src')+'&rand'+Math.random(0,10000));
    return false;
  });
  // Переключение табов
  function tabSwitch() {
    var tabs = $('.productView__tabs');
    var tab = tabs.find('.tab');
    var block = $('.tabs__content > div');
    tab.first().addClass('active');
    block.first().addClass('active');
    // Табы в карточке
    tab.on('click', function(){
      var id = $(this).data('tab');
      var content = tabs.find('.tabs__content > div[data-tab="'+ id +'"]');
      tab.removeClass('active');
      block.removeClass('active');
      $(this).addClass('active');
      content.addClass('active')
    });
  }
  tabSwitch();

  // Показать описание в доставке
  $('.delivery__more').on('click', function(event){
    event.preventDefault();
    if($(this).parent().hasClass('active')) {
      $(this).parent().removeClass('active');
      $(this).parent().find('.delivery__subtitle').slideUp(600);
      $(this).parent().find('.zone__list').slideUp(600);
      $(this).parent().find('.delivery__price').slideUp(600);
    }else{
      $(this).parent().addClass('active');
      $(this).parent().find('.delivery__subtitle').slideDown(600);
      $(this).parent().find('.zone__list').slideDown(600);
      $(this).parent().find('.delivery__price').slideDown(600);
    }
  });

}

// Товары. Категории
function catalogpage() {
  // Фильтры по товарам. При нажании на какую либо характеристику или свойство товара происходит фильтрация товаров
  $('.filter__item input').click(function(){
    $(this)[0].form.submit();
  });
  
  // Открытие сортировки и показать по
  $('.selectBox .select .label').on('click',function(){
    if($(this).parent().parent().hasClass('clicked')){
      if(!$(this).parent().parent().hasClass('opened')){
        $(this).parent().parent().addClass('opened');
        $(this).parent().parent().removeClass('clicked');
      }
    }
  });
  // Закрытие сортировки и показать по
  $(document).mouseup(function (e){
    var selectDown = $(".selectBox .dropdown");
    if (!selectDown.is(e.target)) {
      selectDown.parent().parent().removeClass('opened');
      setTimeout(function(){
        selectDown.parent().parent().addClass('clicked');
      }, 1);
    }
  });
  // Обновление названия сортировки
  var selectText = $('.toolbar .sort-by.selectBox .dropdown .dropdown__item[selected]').text();
  var lengthText = selectText.length;
  if (lengthText == '0' ){
    selectText = 'Название сортировки';
  }
  $('.toolbar .sort-by.selectBox .select .label span').text(selectText);
  
  // Боковое меню сохранение открытой вложенности
  $('.collapsible:not(".active")').find('.filter__items').css('display', 'none');
  $('.collapsible .filter__name').click(function(event){
  event.preventDefault();
    if ($(this).closest('.collapsible').hasClass('active')) {
      $(this).parent().find('.filter__items').slideUp(600);
      $(this).closest('.collapsible').removeClass('active');
    } else {
      $('.filter__items').slideUp(600);
      $('.collapsible').removeClass('active');
      $(this).parent().find('.filter__items').slideDown(600);
      $(this).closest('.collapsible').addClass('active');
    }
  });
  
  // Вы смотрели
  $('.recently__viewed .owl-carousel').owlCarousel({
    items: 4,
    margin: 20,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    navText: [ , ],
    dots: false,
    autoplay: false,
    autoplayHoverPause: true,
    autoHeight: true,
    autoHeightClass: 'owl-height',
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:1},
      320:{items:1, margin: 10},
      481:{items:2, margin: 10},
      641:{items:3, margin: 10},
      768:{items:3, margin: 10},
      992:{items:4},
      1200:{items:4},
      1400:{items:4}
    }
  });
}

// Фильтр по ценам
function priceFilter() {
  var
    priceFilterMinAvailable = parseInt($('.goodsFilterPriceRangePointers .min').text()),  // Минимальное значение цены для фильтра
    priceFilterMaxAvailable = parseInt($('.goodsFilterPriceRangePointers .max').text()),  // Максимальное значение цены для фильтра
    priceSliderBlock = $('#goods-filter-price-slider'), // Максимальное значение цены для фильтра
    priceInputMin = $("#goods-filter-min-price"), // Поле ввода текущего значения цены "От"
    priceInputMax = $("#goods-filter-max-price"), // Поле ввода текущего значения цены "До"
    priceSubmitButtonBlock = $(".goodsFilterPriceSubmit"),  // Блок с кнопкой, которую есть смысл нажимать только тогда, когда изменялся диапазон цен.
    priceSubmitInput = $(".filters-price .inputText");
    
  // Изменяет размер ячеек с ценой, т.к. у них нет рамок, есть смысл менять размеры полей ввода, чтобы они выглядили как текст
  function priceInputsChangeWidthByChars() {
    // Если есть блок указания минимальной цены
    if(priceInputMin.length) {
      priceInputMin.css('width', (priceInputMin.val().length*7 + 20) + 'px');
      priceInputMax.css('width', (priceInputMax.val().length*7 + 20) + 'px');
    }
  }
  
  // Слайдер, который используется для удобства выбора цены
  priceSliderBlock.slider({
    range: true,
    min: priceFilterMinAvailable,
    max: priceFilterMaxAvailable,
    values: [
      parseInt($('#goods-filter-min-price').val())
      ,parseInt($('#goods-filter-max-price').val())
    ],
    slide: function( event, ui ) {
      priceInputMin.val( ui.values[ 0 ] );
      priceInputMax.val( ui.values[ 1 ] );
      priceSubmitButtonBlock.css('display', 'flex');
      priceInputsChangeWidthByChars();
    }
  });
  // При изменении минимального значения цены
  priceInputMin.keyup(function(){
    var newVal = parseInt($(this).val());
    if(newVal < priceFilterMinAvailable) {
      newVal = priceFilterMinAvailable;
    }
    priceSliderBlock.slider("values", 0, newVal);
    priceSubmitButtonBlock.css('display', 'flex');
    priceInputsChangeWidthByChars();
  });
  // При изменении максимального значения цены
  priceInputMax.keyup(function(){
    var newVal = parseInt($(this).val());
    if(newVal > priceFilterMaxAvailable) {
      newVal = priceFilterMaxAvailable;
    }
    priceSliderBlock.slider("values", 1, newVal);
    priceSubmitButtonBlock.css('display', 'flex');
    priceInputsChangeWidthByChars();
  });
  // Обновить размеры полей ввода диапазона цен
  priceInputsChangeWidthByChars();
  
  // Активный фильтр цены
  if (priceInputMin.val() > priceFilterMinAvailable || priceInputMax.val() < priceFilterMaxAvailable) {
    $('.filters-price').addClass('actived');
  }else{
    $('.filters-price').removeClass('actived');
  }
  
}

// Функция + - для товара
function quantity() {
  //Regulator Up копки + в карточке товара при добавлении в корзину
  $('.qty__plus').off('click').click(function(){
    var 
      quantity = $(this).parent().find('.quantity, .cartqty'),
      currentVal = parseInt(quantity.val());
    if (!isNaN(currentVal)){
      quantity.val(currentVal + 1);
      quantity.trigger('keyup');
      quantity.trigger('change');
    }
    return false;
  });
  //Regulator Down копки - в карточке товара при добавлении в корзину
  $('.qty__minus').off('click').click(function(){
    var 
      quantity = $(this).parent().find('.quantity, .cartqty'),
      currentVal = parseInt(quantity.val());
    if (!isNaN(currentVal)){
      quantity.val(currentVal - 1);
      quantity.trigger('keyup');
      quantity.trigger('change');
    }
    return false;
  });
  // Изменение кол-ва в карточке
  if ($('.qty .quantity').length) {
    $('.qty .quantity').change(function(){
      // Если вводят 0 то заменяем на 1
      if($(this).val() < 1){
        $(this).val(1);
      }
      // Обновление кол-ва для функций "Добавить"
      $('.goodsDataMainModificationId').val($(this).val());
      // Количество
      var val = parseInt($(this).val());
      // Цена товара без изменений
      var price = parseInt($('.productView__price .price__now').attr('content'));
      var newPrice = 0;
      // Проверяем наличие добавленных товаров вместе с основным
      if ($('.productView__form [class^="goodsID-"]').length) {
        $('.productView__form [class^="goodsID-"]').each(function(){
          // Сумма всех добавленных товаров
          newPrice += parseInt($(this).attr('data-price'))
        });
      }
      // Считаем новую сумму товара с учетом добавленных
      var multi = val * price + newPrice;
      // Обновляем новую сумму
      $('.productView__price .price__now').attr('data-price', multi).find('.num').text(multi)
    });
  }
}

// Радио кнопки для модификаций
function newModification() {
  $('.goodsModificationsProperty').each(function(){
    a = $(this).find('select option:selected').attr('value');
    $(this).find('.goodsModificationsValue[data-value="'+ a +'"]').addClass('active');
    dis = $(this).find('select option:disabled').attr('value');
    $(this).find('.goodsModificationsValue[data-value="'+ dis +'"]').removeClass('active');
    $(this).find('.goodsModificationsValue[data-value="'+ dis +'"]').addClass('disabled');
  });
  $('.goodsModificationsValue:not(.disabled)').click(function(){
    $(this).parent().find('.goodsModificationsValue').removeClass('active');
    $(this).addClass('active');
    a = $(this).data('value');
    $(this).parent().parent().find('select option[value="' + a + '"]').prop('selected',true);
    $(this).parent().parent().find('select').trigger('change');
  });
  $('.goodsModificationsValue.disabled').off('click');
}

// Модификации
function goodsModification() {
  // Функция собирает свойства в строку, для определения модификации товара
  function getSlugFromGoodsDataFormModificationsProperties(obj) {
    var properties = new Array();
    $(obj).each(function(i){
      properties[i] = parseInt($(this).val());
    });
    return properties.sort(function(a,b){return a - b}).join('_');
  }
   
  var 
    goodsDataProperties = $('.goodsModificationsProperty select[name="form[properties][]"]'),  // Запоминаем поля выбора свойств, для ускорения работы со значениями свойств
    goodsDataModifications = $('.goodsModificationsList'); // Запоминаем блоки с информацией по модификациям, для ускорения работы
    
  // Обновляет возможность выбора свойств модификации, для отключения возможности выбора по характеристикам модификации которой не существует.
  function updateVisibility (y) {
    // Проверяем в каждом соседнем поле выбора модификаций, возможно ли подобрать модификацию для указанных свойств
    goodsDataProperties.each(function(j){
      // Если мы сравниваем значения свойства не с самим собой, а с другим списком значений свойств
      if( j != y ) {
        // Проходим по всем значениям текущего свойства модификации товара
        $(this).find('option').each(function(){
          // Записываем временный массив свойств, которые будем использовать для проверки существования модификации
          var checkProperties = new Array();
          $(goodsDataProperties).each(function(i){
            checkProperties[i] = parseInt($(this).val());
          });
          // Пытаемся найти модификацию соответствующую выбранным значениям свойств
          checkProperties[j] = parseInt($(this).attr('value'));
          // Собираем хэш определяющий модификацию по свойствам
          slug = checkProperties.sort(function(a,b){return a - b}).join('_');
          // Ищем модификацию по всем выбранным значениям свойств товара. Если модификации нет в возможном выборе, отмечаем потенциальное значение выбора как не доступное для выбора, т.к. такой модификации нет.
          if(!goodsDataModifications.filter('[rel="'+slug+'"]').length) {
            $(this).attr('disabled', true);
            $('.goodsModificationsValue[data-value="'+ $(this).val() +'"]').addClass('disabled');
            $('.goodsModificationsValue[data-value="'+ $(this).val() +'"]').attr('disabled', true);
          } else {
            $(this).attr('disabled', false);
            $('.goodsModificationsValue[data-value="'+ $(this).val() +'"]').removeClass('disabled');
            $('.goodsModificationsValue[data-value="'+ $(this).val() +'"]').attr('disabled', true);
          }
        });
      }
    });
  }
  // Обновляем возможность выбора модификации товара по свойствам. Для тех свойств, выбор по которым не возможен, отключаем такую возможность.
  // Проверяем возможность выбора на всех полях кроме первого, чтобы отключить во всех остальных варианты, которые не возможно выбрать
  updateVisibility (0);
  // Проверяем возможность выбора на всех полях кроме второго, чтобы в первом поле так же отключилась возможность выбора не существующих модификаций
  updateVisibility (1);

  // Изменение цены товара при изменении у товара свойства для модификации
  goodsDataProperties.each(function(y){
    $(this).change(function(){
      var slug = getSlugFromGoodsDataFormModificationsProperties(goodsDataProperties),
        modificationBlock             = $('.goodsModificationsList[rel="'+slug+'"]'),
        modificationId                = parseInt(modificationBlock.find('[name="id"]').val()),
        modificationArtNumber         = modificationBlock.find('[name="art_number"]').val(),
        modificationPriceNow          = parseInt(modificationBlock.find('[name="price_now"]').val()),
        modificationPriceNowFormated  = modificationBlock.find('.price_now_formated').html(),
        modificationPriceOld          = parseInt(modificationBlock.find('[name="price_old"]').val()),
        modificationPriceOldFormated  = modificationBlock.find('.price_old_formated').html(),
        modificationRestValue         = parseFloat(modificationBlock.find('[name="rest_value"]').val()),
        modificationDescription       = modificationBlock.find('.description').html(),
        modificationMeasureId         = parseInt(modificationBlock.find('[name="measure_id"]').val()),
        modificationMeasureName       = modificationBlock.find('[name="measure_name"]').val(),
        modificationMeasureDesc       = modificationBlock.find('[name="measure_desc"]').val(),
        modificationMeasurePrecision  = modificationBlock.find('[name="measure_precision"]').val(),
        modificationIsInCompareList   = modificationBlock.find('[name="is_has_in_compare_list"]').val(),
        modificationGoodsModImageId   = modificationBlock.find('[name="goods_mod_image_id"]').val(),
        goodsModView                  = $('.productView'),
        goodsModificationId           = $('.goodsModificationId'),
        goodsPriceNow                 = $('.productView .price__now'),
        goodsPriceOld                 = $('.productView .price__old'),
        goodsAvailable                = goodsModView.find('.productView__available'),
        goodsAvailableTrue            = goodsAvailable.find('.available__true'),
        goodsAvailableFalse           = goodsAvailable.find('.available__false'),
        goodsAvailableQty             = $('.productView__qty'),
        goodsArtNumberBlock           = $('.productView__articles'),
        goodsArtNumber                = goodsArtNumberBlock.find('.goodsModArtNumber'),
        goodsModDescriptionBlock      = $('.goodsModDescription'),
        goodsModRestValue             = goodsModView.find('.goodsModRestValue');
       
      // Изменяем данные товара для выбранных параметров. Если нашлась выбранная модификация
      if(modificationBlock.length) {
        // Цена товара
        goodsPriceNow.html(modificationPriceNowFormated);
        goodsPriceNow.attr('data-price', modificationPriceNow);
        goodsPriceNow.attr('content', modificationPriceNow);
        $('.related .related-box-checkbox').each(function(i, checkbox){
          var $checkbox = $(checkbox);
          var checkboxActive = $checkbox.prop('checked');
          if(checkboxActive) {
            changePrice($checkbox, checkboxActive);
          }
        });
        // Старая цена товара
        if(modificationPriceOld>modificationPriceNow) {
          goodsPriceOld.show();
          goodsPriceOld.html(modificationPriceOldFormated);
          console.log('> price', modificationPriceOld + '>' + modificationPriceNow)
        } else {
          goodsPriceOld.hide();
          console.log('< price', modificationPriceOld + '<' + modificationPriceNow)
        }
        // Есть ли товар есть в наличии
        if(modificationRestValue>0) {
          goodsAvailableTrue.show();
          goodsAvailableFalse.hide();
          goodsModView.removeClass('empty');
          goodsModRestValue.html('Мало');
          goodsModRestValue.attr('data-value', modificationRestValue);
          goodsAvailableQty.find('.quantity').attr('max', modificationRestValue);
          goodsAvailableQty.find('.quantity').val("1");
        // Если товара нет в наличии
        } else {
          goodsAvailableTrue.hide();
          goodsAvailableFalse.show();
          goodsModView.addClass('empty');
          goodsModRestValue.html(modificationRestValue);
          goodsModRestValue.attr('data-value', modificationRestValue);
          goodsAvailableQty.find('.quantity').attr('max', modificationRestValue);
          goodsAvailableQty.find('.quantity').val("1");
        }
        
        if(modificationRestValue>10) {
          goodsModRestValue.html('Много');
          goodsModRestValue.parent().addClass('many');
          goodsModRestValue.parent().removeClass('few');
        } else {
          goodsModRestValue.html('Мало');
          goodsModRestValue.parent().addClass('few');
          goodsModRestValue.parent().removeClass('many');
        }
        
        // Покажем артикул модификации товара, если он указан
        if(modificationArtNumber.length>0) {
          goodsArtNumberBlock.show();
          goodsArtNumber.html(modificationArtNumber);
        // Скроем артикул модификации товара, если он не указан
        } else {
          goodsArtNumberBlock.hide();
          goodsArtNumber.html('');
        }
        // Описание модификации товара. Покажем если оно есть, спрячем если его у модификации нет
        if(modificationDescription.length > 0) {
          goodsModDescriptionBlock.show().html('<div>' + modificationDescription + '</div>');
        } else {
          goodsModDescriptionBlock.hide().html();
        }
        // Идентификатор товарной модификации
        goodsModificationId.val(modificationId);
        $('.goodsDataMainModificationId').attr('name','form[goods_mod_id][' + modificationId + ']');
        // Меняет главное изображение товара на изображение с идентификатором goods_mod_image_id
        function changePrimaryGoodsImage(goods_mod_image_id) {
          // Если не указан идентификатор модификации товара, значит ничего менять не нужно.
          if(1 > goods_mod_image_id) {
            return true;
          }
          var 
            // Блок с изображением выбранной модификации товара
            goodsModImageBlock = $('.thumblist [data-id="' + parseInt(goods_mod_image_id) + '"'),
            // Блок, в котором находится главное изображение товара
            MainImageBlock = $('.productView__image'),
            // Изображение модификации товара, на которое нужно будет изменить главное изображение товара.
            MediumImageUrl = goodsModImageBlock.find('a').attr('href'),
            // Главное изображение, в которое будем вставлять новое изображение
            MainImage = MainImageBlock.find('img'),
            // В этом объекте хранится идентификатор картинки главного изображения для коректной работы галереи изображений
            MainImageIdObject = MainImageBlock.attr('data-id')
          ;
          
          // Если изображение модификации товара найдено - изменяем главное изображение
          MainImage.attr('src', MediumImageUrl);
          // Изменяем идентификатор главного изображения
          MainImageBlock.attr("data-id", parseInt(goods_mod_image_id));
          return true;
        }
        // Обновляем изображние модификации товара, если оно указано
        changePrimaryGoodsImage(modificationGoodsModImageId);
      } else {
        // Отправим запись об ошибке на сервер
        sendError('no modification by slug '+slug);
        alert('К сожалению сейчас не получается подобрать модификацию соответствующую выбранным параметрам.');
      }
      // Обновляем возможность выбора другой модификации для текущих значений свойств модификации товара.
      updateVisibility(y);
    });
  });

  $('.related .related-box-checkbox').on('change', function(){
    var $checkbox = $(this);
    var modId = $checkbox.data('mod-id');
    var checkboxActive = $checkbox.prop('checked');

    if (checkboxActive) {
      // Создаём инпут с доп товаром
      var $input = $('<input class="goodsID-' + modId + '">')
        .attr('type', 'hidden')
        .attr('name', 'form[goods_mod_id][' + modId + ']')
        .attr('data-price', $checkbox.data('mod-price'))
        .val(1);
      $('.productView__form').append($input);
      // Пересчёт цены
      changePrice($checkbox, checkboxActive);
    } else {
      // Удаляем  доп товар
      $('.productView__form').find('input[name="form[goods_mod_id][' + modId + ']"]').remove();
      // Пересчёт цены
      changePrice($checkbox, checkboxActive)
    }
  })

  function changePrice(currentCheckbox, checkboxActive){
    var $checkbox = currentCheckbox;
    var checkboxPrice = $checkbox.data('mod-price');
    var $priceNowBlock = $('.productView__price .price__now');
    var nowPrice = $priceNowBlock.attr('data-price');
    var newPrice = 0;
    if (checkboxActive) {
      newPrice = String(parseInt(nowPrice) + parseInt(checkboxPrice));
      $priceNowBlock.attr('data-price', parseInt(nowPrice) + parseInt(checkboxPrice))
    } else {
      newPrice = String(nowPrice - checkboxPrice);
      $priceNowBlock.attr('data-price', parseInt(nowPrice)  - parseInt(checkboxPrice))
    }
    $priceNowBlock.find('.num').text(parseInt(newPrice))
  }


}

// Сравнение товаров
function Compare() {
  var owlCompare = $('.CompareGoodsTableTbody .owl-carousel');
  owlCompare.owlCarousel({
    items: 4,
    margin: 15,
    loop: false,
    rewind: true,
    lazyLoad: true,
    dots: false,
    nav: false,
    navContainer: '',
    navText: [ , ],
    autoHeight: true,
    autoHeightClass: 'owl-height',
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:2},
      320:{items:2},
      481:{items:2},
      641:{items:3},
      768:{items:3},
      992:{items:4},
      1200:{items:4}
    },
    onInitialized: carouselInitialized,
    onChanged: carouselInitialized
  });
  function carouselInitialized(event){
    if (event.item.count > event.page.size) {
      $('.navigation').css('display', 'flex');
    }else{
      $('.navigation').css('display', 'none');
    }
  }
  $('.CompareGoods__page .navigation .prev, .toLeft').click(function(event) {
    $('.CompareGoodsTableTbody .owl-carousel').trigger('prev.owl.carousel');
  });
  $('.CompareGoods__page .navigation .next, .toRight').click(function(event) {
    $('.CompareGoodsTableTbody .owl-carousel').trigger('next.owl.carousel');
  });
  // Сравнение товаров. Фильтр в верхней навигации. Отображение всех и различающихся характеристик товара
  $('.CompareGoods__switch').click(function(){
    $(this).toggleClass('switch-on');
    if ($(this).hasClass('switch-on')) {
      $(this).trigger('on.switch');
      $('.CompareGoodsTableTbodyComparisonLine:not(.same)').show();
      $('.CompareGoodsTableTbodyComparisonLine.same').hide();
    } else {
      $(this).trigger('off.switch');
      $('.CompareGoodsTableTbodyComparisonLine:hidden').show();
    }
  });
}

// Добавление товара в корзину
function AddCart() {
$('.productView__form, .goodsListForm').off('submit').submit(function() {
  // Выносим функции из шаблонов
  if ($(this).attr('rel') === 'quick') {
    quickOrder(this);
    $('.cart').addClass("hasItems");
    return (false);
  }
  $('.cart').addClass("hasItems");
  $('.addto__cart').addClass("hasItems");
  $('.cart__count').animate({opacity: 0,display: "none"},500);
  $('.cart__count').animate({display: "inline",opacity: 1},500);
  // Находим форму, которую отправляем на сервер, для добавления товара в корзину
  var formBlock = $($(this).get(0));
  var adresCart = '/cart';
    // Проверка на существование формы отправки запроса на добавление товара в корзину
    if (1 > formBlock.length || formBlock.get(0).tagName != 'FORM') {
      alert('Не удалось найти форму добавления товара в корзину');
      return false;
    }
    // Получаем данные формы, которые будем отправлять на сервер
    var formData = formBlock.serializeArray();
    // Сообщаем серверу, что мы пришли через ajax запрос
    formData.push({name: 'ajax_q', value: 1});
    // Так же сообщим ему, что нужно сразу отобразить форму быстрого заказа
    //formData.push({name: 'fast_order', value: 1});
    // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
    $.ajax({
      type: "POST",
      cache: false,
      url: formBlock.attr('action'),
      data: formData,
      success: function(data) {
        // $.fancybox.open(data);
        // Закрытие через 5 секунд
        // setTimeout(function(){$.fancybox.close();}, 5000);
        // Если есть функция, которая отображает сообщения пользователю
        if(typeof(Noty) == "function") {
          new Noty({
            text: '<div class="addto__notice">'+ $(data).html() + '</div>',
            layout:"centerRight",
            type:"",
            theme:"metroui",
            closeWith: ['click', 'button'],
            textAlign:"center",
            easing:"swing",
            animation: {
              open: 'animated fadeInRight',
              close: 'animated fadeOutRight',
              easing: 'swing',
              speed: 500
            },
            timeout:"3000",
            progressBar:true,
            closable:true,
            closeOnSelfClick:true,
            modal:false,
            dismissQueue:false,
            onClose:true,
            killer:false
          }).show();
        }
        // Скрытое обновление корзины
        $('.hiddenUpdate').html(data);
      }
    });
  return false;
});
}

// Добавление в сравнение и Сохраненное
function Addto() {
// Добавление/удаление товара на сравнение/Сохраненное через ajax
$('.add-compare').off('click').click(function(){
  // Объект ссылки, по которой кликнули
  var 
  a = $(this)
  isAdd = a.attr('data-action-is-add'),
  addUrl = a.attr('data-action-add-url'),
  delUrl = a.attr('data-action-delete-url'),
  addTitle = a.attr('data-action-add-title'),
  delTitle = a.attr('data-action-delete-title'),
  pageUrl = a.attr('data-action-url'),
  pName = a.attr('data-prodname'),
  pUrl = a.attr('data-produrl'),
  pImg = a.attr('data-prodimg'),
  pDataid = a.attr('data-id'),
  pDataPrice = a.attr('data-mod-price'),
  pDataMod = a.attr('data-mod-id'),
  aText = a.parent().find('.add-compare'),
  addTooltip = a.attr('data-action-text-add'),
  delTooltip = a.attr('data-action-text-del'),
  requestUrl = a.attr('href');
  
  var atl = $(this).closest('.product__links');
  var atlS = $(this).closest('.product__shop');
  var flag = 0;
  $('.compare__goods .goods__item').each(function(){
    if($(this).attr('data-id') == pDataid){
      flag = 1;
    }
    if(flag == 1){
      $(this).remove();
      return false;
    }
    return flag;
  });
  
  // Если в ссылке присутствует идентификатор, который мы можем узнать только вытащив его с текущей страницы
  if( /GET_GOODS_MOD_ID_FROM_PAGE/.test(requestUrl)) {
    requestUrl = requestUrl.replace(new RegExp('GET_GOODS_MOD_ID_FROM_PAGE'), $('.goodsModificationId').val());
  }
  
  // Если есть информация о том какие URL адреса будут изменены, то можено не перегружать страницу и сделать запрос через ajax
  if(addUrl && delUrl) {
    $.ajax({
      type : "POST",
      dataType: 'json',
      cache : false,
      url : requestUrl,
      data : {
        'ajax_q': 1
      },
      success: function(data) {
        if(flag == 0){
          $('.compare__goods .goods__items').prepend('<div class="goods__item" data-id="'+ pDataid +'"><a href="'+ pUrl +'" title="'+ pName +'" class="goods__image"><img src="'+ pImg +'" class="goods-image-icon" /></a><div class="goods__shop"><a href="'+ pUrl +'" class="goods__name" title="'+ pName +'"><span>'+ pName +'</span></a><div class="goods__priceBox"><div class="goods__price"><span title="'+ pDataPrice +' российских рублей"><span class="num">'+ pDataPrice +'</span> <span>р.</span></span></div><a href="'+ delUrl +'?id='+ pDataMod +'" data-goods-mod-id="'+ pDataMod +'" class="goods__remove remove" title="Убрать товар из списка сравнения" onclick="removeFromCompare($(this))"></a></div></div></div>');
        }
        if('ok' == data.status) {
          if(isAdd == 1) {
            var 
              from = addUrl
              ,to = delUrl
              ,newIsAddStatus = 0
              ,newTitle = delTitle ? delTitle : ''
              ,newTooltip = delTooltip ? delTooltip : ''
            ;
            a.addClass('added');
            atl.addClass('added');
            atlS.addClass('added');
          } else {
            var 
              from = delUrl
              ,to = addUrl
              ,newIsAddStatus = 1
              ,newTitle = addTitle ? addTitle : ''
              ,newTooltip = addTooltip ? addTooltip : ''
            ;
            a.removeClass('added');
            atl.removeClass('added');
            atlS.removeClass('added');
          }
          
          // Если указано, что изменилось число товаров на сравнении
          if(typeof(data.compare_goods_count) != 'undefined') {
            // Блок информации о том, что есть товары на сравнении
            var sidecount = $('.compare__count');
            // Если на сравнении больше нет товаров
            // Указываем информацию о новом количестве товаров на сравнении
            // Блок обновления списка сравнения в каталога
            sidecount.animate({opacity: 0,display: "none"},500,function(){
            sidecount.text(data.compare_goods_count);
            $('.compare__count').attr('data-count', data.compare_goods_count);
              if(data.compare_goods_count > 0){
                $('.compare').addClass("hasItems");
                $('.compare__goods').addClass("hasItems");
                $('#addtoCompare').addClass("hasItems");
              }else{
                $('.compare').removeClass("hasItems");
                $('.compare__goods').removeClass("hasItems");
                $('#addtoCompare').removeClass("hasItems");
                $('.compare__count').attr('data-count', '0').text("0");
                $('.add-compare').removeAttr("title").removeClass("added");
              }
            }).animate({display: "inline",opacity: 1} , 500 );
          }
          
          // Обновляем ссылку, на которую будет уходить запрос и информацию о ней
          a.attr('href', a.attr('href').replace(new RegExp(from), to))
           .attr('title', newTitle)
           .attr('data-tooltipOFF', newTooltip)
           .attr('data-action-is-add', newIsAddStatus);
          
          // Если рядом с ссылкой в виде круга есть текстовая надпись с описанием действия
          //if(aText.length) {
          //  aText.text(aText.attr(isAdd == 1 ? 'data-action-text-del' : 'data-action-text-add'));
          //}
          // Если есть функция, которая отображает сообщения пользователю
          if(typeof(Noty) == "function") {
            new Noty({
              text: '<div class="addto__notice">'+ data.message + '</div>',
              layout:"centerRight",
              type:"",
              theme:"metroui",
              closeWith: ['click', 'button'],
              textAlign:"center",
              easing:"swing",
              animation: {
                open: 'animated fadeInRight',
                close: 'animated fadeOutRight',
                easing: 'swing',
                speed: 500
              },
              timeout:"3000",
              progressBar:true,
              closable:true,
              closeOnSelfClick:true,
              modal:false,
              dismissQueue:false,
              onClose:true,
              killer:false
            }).show();
          }
        } else if('error' == data.status) {
          // Если есть функция, которая отображает сообщения пользователю
          if(typeof(Noty) == "function") {
            new Noty({
              text: '<div class="addto__notice error">'+ data.message + '</div>',
              layout:"centerRight",
              type:"",
              theme:"metroui",
              closeWith: ['click', 'button'],
              textAlign:"center",
              easing:"swing",
              animation: {
                open: 'animated fadeInRight',
                close: 'animated fadeOutRight',
                easing: 'swing',
                speed: 500
              },
              timeout:"3000",
              progressBar:true,
              closable:true,
              closeOnSelfClick:true,
              modal:false,
              dismissQueue:false,
              onClose:true,
              killer:false
            }).show();
          }
        }
      }
    });
    return false;
  }
});
// Добавление/удаление товара на сравнение/Сохраненное через ajax
$('.add-favorites').off('click').click(function(){
  // Объект ссылки, по которой кликнули
  var 
  a = $(this)
  addUrl = a.attr('data-action-add-url'),
  delUrl = a.attr('data-action-delete-url'),
  addTitle = a.attr('data-action-add-title'),
  delTitle = a.attr('data-action-delete-title'),
  isAdd = a.attr('data-action-is-add'),
  pName = a.attr('data-prodname'),
  pUrl = a.attr('data-produrl'),
  pImg = a.attr('data-prodimg'),
  pPrice = a.attr('data-prodprice'),
  pDataid = a.attr('data-id'),
  pDataPrice = a.attr('data-mod-price'),
  pDataMod = a.attr('data-mod-id'),
  pDataGoodsid = a.attr('data-goodsid'),
  aText = a.parent().find('.add-favorites'),
  addTooltip = a.attr('data-action-text-add'),
  delTooltip = a.attr('data-action-text-del'),
  requestUrl = a.attr('href');
  
  var atl = $(this).closest('.product__links');
  var atlS = $(this).closest('.product__shop');
  var flag = 0;
  $('.favorites__goods .goods__item').each(function(){
    if($(this).attr('data-id') == pDataid){
      flag = 1;
    }
    if(flag == 1){
      $(this).remove();
      return false;
    }
    return flag;
  });
  
  // Если в ссылке присутствует идентификатор, который мы можем узнать только вытащив его с текущей страницы
  if( /GET_GOODS_MOD_ID_FROM_PAGE/.test(requestUrl)) {
    requestUrl = requestUrl.replace(new RegExp('GET_GOODS_MOD_ID_FROM_PAGE'), $('.goodsModificationId').val());
  }
  
  // Если есть информация о том какие URL адреса будут изменены, то можено не перегружать страницу и сделать запрос через ajax
  if(addUrl && delUrl) {
    $.ajax({
      type : "POST",
      dataType: 'json',
      cache : false,
      url : requestUrl,
      data : {
        'ajax_q': 1
      },
      success: function(data) {
        if(flag == 0){
          $('.favorites__goods .goods__items').prepend('<div class="goods__item" data-id="'+ pDataid +'"><a href="'+ pUrl +'" title="'+ pName +'" class="goods__image"><img src="'+ pImg +'" class="goods-image-icon" /></a><div class="goods__shop"><a href="'+ pUrl +'" class="goods__name" title="'+ pName +'"><span>'+ pName +'</span></a><div class="goods__priceBox"><div class="goods__price"><span title="'+ pDataPrice +' российских рублей"><span class="num">'+ pDataPrice +'</span> <span>р.</span></span></div><a href="'+ delUrl +'?id='+ pDataMod +'" data-goods-mod-id="'+ pDataMod +'" class="goods__remove remove" title="Убрать товар из списка избранного" onclick="removeFromFavorites($(this))"></a></div></div></div>');
        }
        if('ok' == data.status) {
          if(isAdd == 1) {
            var 
              from = addUrl
              ,to = delUrl
              ,newIsAddStatus = 0
              ,newTitle = delTitle ? delTitle : ''
              ,newTooltip = delTooltip ? delTooltip : ''
            ;
            a.addClass('added');
            atl.addClass('added');
            atlS.addClass('added');
          } else {
            var 
              from = delUrl
              ,to = addUrl
              ,newIsAddStatus = 1
              ,newTitle = addTitle ? addTitle : ''
              ,newTooltip = addTooltip ? addTooltip : ''
            ;
            a.removeClass('added');
            atl.removeClass('added');
            atlS.removeClass('added');
          }
          
          // Если указано, что изменилось число товаров на сравнении
          if(typeof(data.favorites_goods_count) != 'undefined') {
            // Блок информации о том, что есть товары на сравнении
            var sidecount = $('.favorites__count');
            // Если на сравнении больше нет товаров
            // Указываем информацию о новом количестве товаров на сравнении
            // Блок обновления списка сравнения в каталога
            sidecount.animate({opacity: 0,display: "none"},500,function(){
            sidecount.text(data.favorites_goods_count);
            $('.favorites__count').attr('data-count', data.favorites_goods_count);
              if(data.favorites_goods_count > 0){
                $('.favorites').addClass("hasItems");
                $('.favorites__goods').addClass("hasItems");
                $('#addtoFavorites').addClass("hasItems");
              }else{
                $('.favorites').removeClass("hasItems");
                $('.favorites__goods').removeClass("hasItems");
                $('#addtoFavorites').removeClass("hasItems");
                $('.favorites__count').attr('data-count', '0').text("0");
                $('.add-favorites').removeAttr("title").removeClass("added");
              }
            }).animate({display: "inline",opacity: 1} , 500 );
          }
          
          // Обновляем ссылку, на которую будет уходить запрос и информацию о ней
          a.attr('href', a.attr('href').replace(new RegExp(from), to))
           .attr('title', newTitle)
           .attr('data-tooltipOFF', newTooltip)
           .attr('data-action-is-add', newIsAddStatus);
            
          // Если рядом с ссылкой в виде круга есть текстовая надпись с описанием действия
          //if(aText.length) {
          //  aText.text(aText.attr(isAdd == 1 ? 'data-action-text-del' : 'data-action-text-add'));
          //}
          // Если есть функция, которая отображает сообщения пользователю
          if(typeof(Noty) == "function") {
            new Noty({
              text: '<div class="addto__notice">'+ data.message + '</div>',
              layout:"centerRight",
              type:"",
              theme:"metroui",
              closeWith: ['click', 'button'],
              textAlign:"center",
              easing:"swing",
              animation: {
                open: 'animated fadeInRight',
                close: 'animated fadeOutRight',
                easing: 'swing',
                speed: 500
              },
              timeout:"3000",
              progressBar:true,
              closable:true,
              closeOnSelfClick:true,
              modal:false,
              dismissQueue:false,
              onClose:true,
              killer:false
            }).show();
          }
        } else if('error' == data.status) {
          // Если есть функция, которая отображает сообщения пользователю
          if(typeof(Noty) == "function") {
            new Noty({
              text: '<div class="addto__notice error">'+ data.message + '</div>',
              layout:"centerRight",
              type:"",
              theme:"metroui",
              closeWith: ['click', 'button'],
              textAlign:"center",
              easing:"swing",
              animation: {
                open: 'animated fadeInRight',
                close: 'animated fadeOutRight',
                easing: 'swing',
                speed: 500
              },
              timeout:"3000",
              progressBar:true,
              closable:true,
              closeOnSelfClick:true,
              modal:false,
              dismissQueue:false,
              onClose:true,
              killer:false
            }).show();
          }
        }
      }
    });
    return false;
  }
});
}

// Удаление товара из Сравнения без обновлении страницы
function removeFromFavorites(e){
  event.preventDefault();
  if(confirm('Вы точно хотите удалить товар из сравнения?')){
  var del = e;
  var num = $('.favorites__count').attr('data-count');
  e.parent().parent().parent().fadeOut().remove();
  url = del.attr('href');
  goodsModId = $(del).attr('data-goods-mod-id');
  $.ajax({ 
    cache : false,
    url		: url,
    success: function(d){
      var oldCount = num;
      var newCount = oldCount - 1;
      $('.favorites__count').attr('data-count', newCount).text(newCount);
      var flag = 0;
      if(newCount != 0){
        $('.favorites__goods .goods__item').each(function(){
          if(flag == 0){
            if($(this).css('display') == 'none'){
              $(this).css('display', 'flex');
            flag++;
            }
          }
        });
      }else{
        $('#addtoFavorites').removeClass("hasItems");
        $('.favorites').removeClass("hasItems");
        $('.favorites__count').removeClass("hasItems");
        $('.favorites__count').attr('data-count', '0').text('0');
        $('.favorites__goods .goods__empty').show();
        $('.favorites__goods .goods__buttons').hide();
      }
      var obj = $('.add-favorites[data-mod-id="' + goodsModId + '"]');
      if(obj.length) {
        obj.attr("data-action-is-add", "1")
        .removeAttr("title")
        .removeClass("added")
        .attr("href", obj.attr("href").replace(obj.attr('data-action-delete-url'), obj.attr('data-action-add-url')));
      }
		}
  });
  }
}
// Удаление ВСЕХ товаров из Сравнения без обновлении страницы
function removeFromFavoritesAll(e){
  event.preventDefault();
  if(confirm('Вы точно хотите очистить сравнение?')){
  // Предзагрузчик анимации
  $('.favorites__goods').prepend('<div class="preloader small"><div class="loading"></div></div>');
  var del = e;  
  e.parent().fadeOut();
  url = del.attr('href');
  $.ajax({
    cache  : false,
    url		 : url,
    success: function(d){
      $('#addtoFavorites').removeClass("hasItems");
      $('.favorites').removeClass("hasItems");
      $('.favorites__goods').removeClass("hasItems");
      $('.favorites__count').attr('data-count', '0').text("0");
      $('.favorites__goods .goods__item').remove();
      $('.favorites__goods .goods__buttons').hide();
      $('.favorites__goods .goods__empty').show();
      $('.favorites__goods .preloader').hide();
      $('.add-favorites').removeAttr("title").removeClass("added");
    }
  });
  }
}

// Удаление товара из Сравнения без обновлении страницы
function removeFromCompare(e){
  event.preventDefault();
  if(confirm('Вы точно хотите удалить товар из сравнения?')){
  var del = e;
  var num = $('.compare__count').attr('data-count');
  e.parent().parent().parent().fadeOut().remove();
  url = del.attr('href');
  goodsModId = $(del).attr('data-goods-mod-id');
  $.ajax({ 
    cache : false,
    url		: url,
    success: function(d){
      var oldCount = num;
      var newCount = oldCount - 1;
      $('.compare__count').attr('data-count', newCount).text(newCount);
      var flag = 0;
      if(newCount != 0){
        $('.compare__goods .goods__item').each(function(){
          if(flag == 0){
            if($(this).css('display') == 'none'){
              $(this).css('display', 'flex');
            flag++;
            }
          }
        });
      }else{
        $('#addtoCompare').removeClass("hasItems");
        $('.compare').removeClass("hasItems");
        $('.compare__goods').removeClass("hasItems");
        $('.compare__count').attr('data-count', '0').text('0');
        $('.compare__goods .goods__empty').show();
        $('.compare__goods .goods__buttons').hide();
      }
      var obj = $('.add-compare[data-mod-id="' + goodsModId + '"]');
      if(obj.length) {
        obj.attr("data-action-is-add", "1")
        .removeAttr("title")
        .removeClass("added")
        .attr("href", obj.attr("href").replace(obj.attr('data-action-delete-url'), obj.attr('data-action-add-url')));
      }
		}
  });
  }
}
// Удаление ВСЕХ товаров из Сравнения без обновлении страницы
function removeFromCompareAll(e){
  event.preventDefault();
  if(confirm('Вы точно хотите очистить сравнение?')){
  // Предзагрузчик анимации
  $('.compare__goods').prepend('<div class="preloader small"><div class="loading"></div></div>');
  var del = e;  
  e.parent().fadeOut();
  url = del.attr('href');
  $.ajax({
    cache  : false,
    url		 : url,
    success: function(d){
      $('#addtoCompare').removeClass("hasItems");
      $('.compare').removeClass("hasItems");
      $('.compare__goods').removeClass("hasItems");
      $('.compare__count').attr('data-count', '0').text("0");
      $('.compare__goods .goods__item').remove();
      $('.compare__goods .goods__buttons').hide();
      $('.compare__goods .goods__empty').show();
      $('.compare__goods .preloader').hide();
      $('.add-compare').removeAttr("title").removeClass("added");
    }
  });
  }
}

// Удаление товара из корзины без обновлении страницы
function removeFromCart(e){
  event.preventDefault();
  if(confirm('Вы точно хотите удалить товар из корзины?')){
  var del = e;  
  e.parent().parent().parent().fadeOut().remove();
  url = del.attr('href');
  quantity = del.data('quantity');
  $('.cartSum').animate({opacity: 0},500);
  $('.addto__count').animate({opacity: 0},500);
  $.ajax({
    cache  : false,
		url		 : url,
    success: function(d){
      var oldCount = $('.cart__count').attr('data-count');
      var oldQuantity = quantity;
      var newCount = oldCount - oldQuantity;
      $('.cart__count').attr('data-count', newCount).text(newCount);
      $('.cartSum').animate({opacity: 1},500);
      $('.cartSum').html($(d).find('.cartSum').html());
      $('.addto__count').animate({opacity: 1},500);
      $('.addto__count').html($(d).find('.addto__count').html());
      console.log($(d).find('.addto__count').html());
      var flag = 0; 
      if(newCount != 0){
      $('.addto__cart .goods__item').each(function(){
        if(flag == 0){
          if($(this).css('display') == 'none'){
            $(this).css('display', 'flex');
          flag++;
          }
        }
      })}else{
        $('#addtoCart').removeClass("hasItems");
        $('.cart').removeClass("hasItems");
        $('.addto__cart').removeClass("hasItems");
        $('.cart__count').attr('data-count', '0').text("0");
        $('.addto__cart .goods__item').remove();
        $('.addto__cart .goods__buttons').hide();
        $('.addto__cart .goods__empty').show();
        $('.addto__cart .preloader').hide();
        $('.cart__full').hide();
        $('.addto__count').hide();
      }
    }
  });
  }
}
// Удаление ВСЕХ товаров из Корзины без обновлении страницы
function removeFromCartAll(e){
  event.preventDefault();
  if(confirm('Вы точно хотите очистить корзину?')){
  // Предзагрузчик анимации
  $('.addto__cart').prepend('<div class="preloader small"><div class="loading"></div></div>');
  var del = e;
  url = del.attr('href');
  $.ajax({ 
    cache  : false,
    url		 : url,
    success: function(d){
      $('#addtoCart').removeClass("hasItems");
      $('.cart').removeClass("hasItems");
      $('.addto__cart').removeClass("hasItems");
      $('.cart__count').attr('data-count', '0').text("0");
      $('.addto__cart .goods__item').remove();
      $('.addto__cart .goods__buttons').hide();
      $('.addto__cart .goods__empty').show();
      $('.addto__cart .preloader').hide();
      $('.cart__full').hide();
      $('.addto__count').hide();
		}
  });
  }
}

// Валидаторы для телефона в "Подсказать" на главной
function validName(){
  var name = $('#callback').find('.form__person');
  if(name.val() != ''){
    name.removeClass('error');
    name.attr('placeholder','Введите Имя');
    return true;
  }else{
    name.addClass('error');
    name.attr('placeholder','Вы не ввели Имя');
    setTimeout(function(){
      name.removeClass('error');
      name.attr('placeholder','Введите Имя');
    }, 5000);
    return false;
  } 
}
function validPhone(){ 
  var tel = $('#callback').find('.form__phone');
  var check = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{5,10}$/.test(tel.val());
  if(check == true && check != ''){
    tel.removeClass('error');
    tel.attr('placeholder','Введите номер');
    return true;
  }
  else{
    tel.addClass('error');
    tel.attr('placeholder','Вы ввели неверный номер');
    setTimeout(function(){
      tel.removeClass('error');
      tel.attr('placeholder','Введите номер');
    }, 5000);
    return false;
  }
}
// Проверка телефона в обратном звонке.
function validSubmit(){
  var name = validName();
  var phone = validPhone();
  return name && phone;
}
// Проверка отправки формы
$(function(){
  $('#callback .form__callback').submit(validSubmit);
});

// Валидаторы для телефона на странице обратного звонка /callback
function validNameMain(){
  var name = $('#main').find('.form__person');
  if(name.val() != ''){
    name.removeClass('error');
    name.attr('placeholder','Введите Имя');
    return true;
  }else{
    name.addClass('error');
    name.attr('placeholder','Вы не ввели Имя');
    setTimeout(function(){
      name.removeClass('error');
      name.attr('placeholder','Введите Имя');
    }, 5000);
    return false;
  }
}
function validPhoneMain(){
  var tel = $('#main').find('.form__phone');
  var check = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{5,10}$/.test(tel.val());
  if(check == true && check != ''){
    tel.removeClass('error');
    tel.attr('placeholder','Введите номер');
    return true;
  }
  else{
    tel.addClass('error');
    tel.attr('placeholder','Вы ввели неверный номер');
    setTimeout(function(){
      tel.removeClass('error');
      tel.attr('placeholder','Введите номер');
    }, 5000);
    return false;
  }
}
// Проверка телефона в обратном звонке.
function validSubmitMain(){
  var name = validNameMain();
  var phone = validPhoneMain();
  return name && phone;
}
// Проверка отправки формы
$(function(){
  $('#main .form__callback').submit(validSubmitMain);
});

// Подписаться. Валидатор почты в Подписаться
function validEmail(){ 
  var email = $('#subscribe').find('.form__email');
  var check = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.val());
  if(check == true && check != ''){
    email.removeClass('error');
    email.attr('placeholder','Введите Email');
    return true;
  }else{
    email.addClass('error');
    email.val('');
    email.attr('placeholder','Вы ввели неверный Email');
    setTimeout(function(){
      email.removeClass('error');
      email.attr('placeholder','Введите Email');
    }, 5000);
    return false;
  }
}
// Проверка телефона в обратном звонке.
function validSubmitEmail(){
  var email = validEmail();
  return email;
}
// Проверка отправки формы
$(function(){
  $('#subscribe .form__callback').submit(validSubmitEmail);
});

// Валидаторы для Имени и телефона в "Служба поддержки" на главной
function validNameFancy(){
  var name = $('#fancybox__callback').find('.form__person');
  if(name.val() != ''){
    name.removeClass('error');
    name.attr('placeholder','Введите Имя');
    return true;
  }else{
    name.addClass('error');
    name.attr('placeholder','Вы не ввели Имя');
    setTimeout(function(){
      name.removeClass('error');
      name.attr('placeholder','Введите Имя');
    }, 5000);
    return false;
  } 
}
function validPhoneFancy(){
  var tel = $('#fancybox__callback').find('.form__phone');
  check = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{5,10}$/.test(tel.val());
  if(check == true && check != ''){
    tel.removeClass('error');
    tel.attr('placeholder','Введите номер');
    return true;
  }
  else{
    tel.addClass('error');
    tel.attr('placeholder','Вы ввели неверный номер');
    setTimeout(function(){
      tel.removeClass('error');
      tel.attr('placeholder','Введите номер');
    }, 5000);
    return false;
  }
}
function validSubmitFancy(){
  var name = validNameFancy();
  var phone = validPhoneFancy();
  return name && phone;
}
// Проверка отправки формы
$(function(){
  $('#fancybox__callback .form__callback').submit(validSubmitFancy);
});

// Валидаторы для телефона в "Уведомить" в карточке товара
function validPhoneNotify(){
  var tel = $('#fancybox__notify').find('.form__phone');
  check = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{5,10}$/.test(tel.val());
  if(check == true && check != ''){
    tel.removeClass('error');
    tel.attr('placeholder','Введите номер');
    return true;
  }
  else{
    tel.addClass('error');
    tel.attr('placeholder','Вы ввели неверный номер');
    setTimeout(function(){
      tel.removeClass('error');
      tel.attr('placeholder','Введите номер');
    }, 5000);
    return false;
  }
}
// Подписаться. Валидатор почты в "Уведомить"
function validEmailNotify(){
  var email = $('#fancybox__notify').find('.form__email');
  var check = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.val());
  if(check == true && check != ''){
    email.removeClass('error');
    email.attr('placeholder','Введите Email');
    return true;
  }else{
    email.addClass('error');
    email.val('');
    email.attr('placeholder','Вы ввели неверный Email');
    setTimeout(function(){
      email.removeClass('error');
      email.attr('placeholder','Введите Email');
    }, 5000);
    return false;
  }
}
function validSubmitNotify(){
  var email = validEmailNotify();
  var phone = validPhoneNotify();
  return email || phone;
}
// Проверка отправки формы
$(function(){
  $('#fancybox__notify .form__callback').submit(validSubmitNotify);
});

// Функция Быстрого просмотра товара
function quickView() {
// Получение центральной разметки страницы (для быстрого просмотра)
$(document).ready(function(){
  $.fn.getColumnContent = function() {
    var block = ($(this).length && $(this).hasClass('productViewBlock') ? $(this).filter('.productViewBlock') : $('.productViewBlock:eq(0)'));
    block.find('#main').each(function(){
      // Удаляем все блоки, которые не отображаются в быстром просмотре.
      if(!$(this).hasClass('productView__imageBox') && !$(this).hasClass('productView__shop') && !$(this).hasClass('productView__actions') && !$(this).hasClass('productView__titleBox')) {
        $(this).remove();
      }
    });
    return block;
  }
});
// Быстрый просмотр товара
$(document).ready(function(){
  // При наведении на блок товара загружаем контент этого товара, который будет использоваться для быстрого просмотра, чтобы загрузка происходила быстрее.
  $('.product__item').mouseover(function() {
    // Если в блоке нет ссылки на быстрый просмотр, то не подгружаем никаких данных
    var link = $(this).find('a.quickview');
    if(link.length < 1) {
      return true;
    }
    // Если массив с подгруженными заранее карточками товара для быстрого просмотра ещё не создан - создадим его.
    if(typeof(document.quickviewPreload) == 'undefined') {
      document.quickviewPreload = [];
    }
    var href = link.attr('href');
    href += (false !== href.indexOf('?') ? '&' : '?') + 'only_body=1';
    // Если контент по данной ссылке ещё не загружен
    if(typeof(document.quickviewPreload[href]) == 'undefined') {
      // Ставим отметку о том, что мы начали загрузку страницы товара
      document.quickviewPreload[href] = 1;
      // Делаем запрос на загрузку страницы товара
      $.get(href, function(content) {
        // Сохраняем контент, необходимый для быстрого просмотра в специально созданный для этого массив
        document.quickviewPreload[href] = $(content).getColumnContent();
      })
      // Если загрузить страницу не удалось, удаляем отметку о том, что мы подгрузили эту страницу
      .fail(function() {
        delete document.quickviewPreload[href];
      });
    }
  });
});
// Действие при нажатии на кнопку быстрого просмотра.  
$(document).ready(function(){
  $(document).on('click', 'a.quickview', function() {
    var href = $(this).attr('href');
    href += (false !== href.indexOf('?') ? '&' : '?') + 'only_body=1';
    quickViewShow(href);
    $(function(){
      const observer = lozad(); // lazy loads elements with default selector as '.lozad'
      observer.observe();
    });
    preload();
    $('.fancybox-content .productView').removeClass('productViewMod');
    $('.fancybox-content .productView').addClass('productViewQuick');
    return false;
  });
});
}
// Быстрый просмотр товара
function quickViewShow(href, atempt) {
  // Если данные по быстрому просмотру уже подгружены
  if(typeof(document.quickviewPreload[href]) != 'undefined') {
    // Если мы в режиме загрузки страницы и ждём результата от другой функции, то тоже подождём, когда тот контент загрузится и будет доступен в этом массиве.
    if(1 == document.quickviewPreload[href]) {
      // Если попытки ещё не указывались, ставим 0 - первая попытка
      if(typeof(atempt) == 'undefined') {
        atempt = 0;
      // Иначе прибавляем счётчик попыток
      } else {
        atempt += 1;
        // Если больше 500 попыток, то уже прошло 25 секунд и похоже, что быстрый просмотр не подгрузится, отменяем информацию о том, что контент загружен
        if(atempt > 500) {
          delete document.quickviewPreload[href];
          alert('Не удалось загрузить страницу товара. Пожалуйста, повторите попытку позже.');
          return true;
        }
      }
      // Запустим функцию быстрого просмотра через 5 сотых секунды, вероятно запрошендная страница товара уже подгрузится. 
      setTimeout('quickViewShow("' + href + '", '+ atempt +')', 50);
      return true;
    } else {
      $.fancybox.close();
      $.fancybox.open(document.quickviewPreload[href]);
      AddCart();
      Addto();
      goodsModification();
      newModification();
      quantity();
      $('.fancybox-content .productView').removeClass('productViewMod');
      $('.fancybox-content .productView').addClass('productViewQuick');
    }
  } else {
    $.get(href, function(content) {
      $.fancybox.close();
      $.fancybox.open($(content).getColumnContent());
      AddCart();
      Addto();
      goodsModification();
      newModification();
      quantity();
      $('.fancybox-content .productView').removeClass('productViewMod');
      $('.fancybox-content .productView').addClass('productViewQuick');
    });
  }
}

// Функция выбора модификаций
function quickViewMod() {
// Получение центральной разметки страницы (для быстрого просмотра)
$(document).ready(function(){
  $.fn.getColumnContent = function() {
    var block = ($(this).length && $(this).hasClass('productViewBlock') ? $(this).filter('.productViewBlock') : $('.productViewBlock:eq(0)'));
    block.find('#main').each(function(){
      // Удаляем все блоки, которые не отображаются в быстром просмотре.
      if(!$(this).hasClass('productView__imageBox') && !$(this).hasClass('productView__shop') && !$(this).hasClass('productView__actions') && !$(this).hasClass('productView__titleBox')) {
        $(this).remove();
      }
    });
    return block;
  }
});
// Быстрый просмотр товара
$(document).ready(function(){
  // При наведении на блок товара загружаем контент этого товара, который будет использоваться для быстрого просмотра, чтобы загрузка происходила быстрее.
  $('.product__item').mouseover(function() {
    // Если в блоке нет ссылки на быстрый просмотр, то не подгружаем никаких данных
    var link = $(this).find('a.quickViewMod');
    if(link.length < 1) {
      return true;
    }
    // Если массив с подгруженными заранее карточками товара для быстрого просмотра ещё не создан - создадим его.
    if(typeof(document.quickviewPreload) == 'undefined') {
      document.quickviewPreload = [];
    }
    var href = link.attr('href');
    href += (false !== href.indexOf('?') ? '&' : '?') + 'only_body=1';
    // Если контент по данной ссылке ещё не загружен
    if(typeof(document.quickviewPreload[href]) == 'undefined') {
      // Ставим отметку о том, что мы начали загрузку страницы товара
      document.quickviewPreload[href] = 1;
      // Делаем запрос на загрузку страницы товара
      $.get(href, function(content) {
        // Сохраняем контент, необходимый для быстрого просмотра в специально созданный для этого массив
        document.quickviewPreload[href] = $(content).getColumnContent();
      })
      // Если загрузить страницу не удалось, удаляем отметку о том, что мы подгрузили эту страницу
      .fail(function() {
        delete document.quickviewPreload[href];
      });
    }
  });
});
// Действие при нажатии на кнопку быстрого просмотра.  
$(document).ready(function(){
  $(document).on('click', 'a.quickViewMod', function() {
    var href = $(this).attr('href');
    href += (false !== href.indexOf('?') ? '&' : '?') + 'only_body=1';
    quickViewShowMod(href);
    $('.fancybox-content .productView').removeClass('productViewQuick');
    $('.fancybox-content .productView').addClass('productViewMod');
    return false;
  });
});
}
// Быстрый просмотр модификаций
function quickViewShowMod(href, atempt) {
  // Если данные по быстрому просмотру уже подгружены
  if(typeof(document.quickviewPreload[href]) != 'undefined') {
    // Если мы в режиме загрузки страницы и ждём результата от другой функции, то тоже подождём, когда тот контент загрузится и будет доступен в этом массиве.
    if(1 == document.quickviewPreload[href]) {
      // Если попытки ещё не указывались, ставим 0 - первая попытка
      if(typeof(atempt) == 'undefined') {
        atempt = 0;
      // Иначе прибавляем счётчик попыток
      } else {
        atempt += 1;
        // Если больше 500 попыток, то уже прошло 25 секунд и похоже, что быстрый просмотр не подгрузится, отменяем информацию о том, что контент загружен
        if(atempt > 500) {
          delete document.quickviewPreload[href];
          alert('Не удалось загрузить страницу товара. Пожалуйста, повторите попытку позже.');
          return true;
        }
      }
      // Запустим функцию быстрого просмотра через 5 сотых секунды, вероятно запрошендная страница товара уже подгрузится. 
      setTimeout('quickViewShowMod("' + href + '", '+ atempt +')', 50);
      return true;
    } else {
      $.fancybox.close();
      $.fancybox.open(document.quickviewPreload[href]);
      AddCart();
      Addto();
      goodsModification();
      newModification();
      quantity();
      $('.fancybox-content .productView').removeClass('productViewQuick');
      $('.fancybox-content .productView').addClass('productViewMod');
    }
  } else {
    $.get(href, function(content) {
      $.fancybox.close();
      $.fancybox.open($(content).getColumnContent());
      AddCart();
      Addto();
      goodsModification();
      newModification();
      quantity();
      $('.fancybox-content .productView').removeClass('productViewQuick');
      $('.fancybox-content .productView').addClass('productViewMod');
    });
  }
}

// Быстрый заказ
function quickOrder(formSelector) {
  // Находим форму, которую отправляем на сервер, для добавления товара в корзину
  var formBlock = $($(formSelector).get(0));
  // Проверка на существование формы отправки запроса на добавление товара в корзину
  if(1 > formBlock.length || formBlock.get(0).tagName != 'FORM') {
    alert('Не удалось найти форму добавления товара в корзину');
    return false;
  }
  // Получаем данные формы, которые будем отправлять на сервер
  var formData = formBlock.serializeArray();
  // Сообщаем серверу, что мы пришли через ajax запрос
  formData.push({name: 'ajax_q', value: 1});
  // Так же сообщим ему, что нужно сразу отобразить форму быстрого заказа 
  formData.push({name: 'fast_order', value: 1});
  // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
  $.ajax({
    type    : "POST",
		cache	  : false,
		url		  : formBlock.attr('action'),
		data		: formData,
		success: function(data) {
			$.fancybox.open(data);
			preload();
			showPass();
			OrderScripts();
			OrderScriptsSelect();
      coupons();
      $('.fastOrder__form').validate({
        errorPlacement: function(error, element) { }
      });
      // Скрытое обновление корзины
      $('.hiddenUpdate').html(data);
		}
	});
  return false;
}

// Регистрация и выбор доставки
function OrderScripts() {
  // маска телефона
  $("#sites_client_phone").mask("+7 (999) 999-9999");
  // Выбор даты доставки. Документация к плагину //t1m0n.name/air-datepicker/docs/index-ru.html
  $("#deliveryConvenientDate").datepicker({
    // Если true, то при активации даты, календарь закроется.
    autoClose: true,
    // Можно выбрать только даты, идущие за сегодняшним днем, включая сегодня
    minDate: new Date()
  });
  // При оформлении заказа дадим возможность зарегистрироваться пользователю
  $('#form__wantRegister').click(function(){
    if($(this).prop("checked")) {
      $('.form__WantRegisterPass').show();
      $('#sites_client_email').addClass('required');
      $('#sites_client_email').attr("required", true);
      $(this).parent().addClass('active');
      $(this).attr("checked", true);
      $('.form__fields.email label').addClass('required');
    } else {
      $('.form__WantRegisterPass').hide();
      $('#sites_client_email').removeClass('required');
      $('#sites_client_email').attr("required", false);
      $(this).parent().removeClass('active');
      $(this).attr("checked", false);
      $('.form__fields.email label').removeClass('required');
    }
  });
  // Отображение вариантов оплаты
  var ID = $('input[name="form[delivery][id]"]:checked').val();
  $('.order__payment').hide();
  $('.order__payment[rel="' + ID + '"]').show();
  $('.order__payment[rel="' + ID + '"]').find('input:first').click();
  // Действия при выборе варианта доставки на этапе оформления заказа
  $('.delivery__radio').click(function(d){
    // Отображение вариантов оплаты при выборе доставки
    var ID = $('input[name="form[delivery][id]"]:checked').val();
    $('.order__payment').hide();
    $('.order__payment[rel="' + ID + '"]').show();
    $('.order__payment[rel="' + ID + '"]').find('input:first').click();
    $('.delivery__radio').each(function(){
      $(this).prop('checked',false);
    });
    $('.zone__radio').each(function(){
      $(this).prop('checked',false);
    });
    var val = $(this).val();
    var fz = $($('.zone__radio[deliveryid='+val+']')[0]);       
    $(this).prop('checked',true);
    fz.prop('checked',true);
    var price = $(this).attr('price');
    var priceBlock = $('.delivery__option[rel='+ val +']').find('.delivery__price').find('.num');
    // Обновление цены при наличии зоны
    var cartSumTotal = $('.cartSumTotal').data('value');
    var zonePrice =  $('.zone__radio:checked').attr('price');
    if(zonePrice > 0){
      priceBlock.text(zonePrice);
      $('.cartSumDelivery .num').text(zonePrice);
    }else{
      priceBlock.text(price);
      $('.cartSumDelivery .num').text(price);
    }
    // Обновление цены с учетом доставки
    var cartSumTotalHide = $('.cartSumTotalHide:eq(0) .num').text().toString().replace(/\s/g, '');
    var newSum = parseInt(cartSumTotalHide) + parseInt(priceBlock.text());
    $('.cartSumTotal .num').text(newSum);
    // Скрытие необязательных полей при выборе самовывоза
    if($(this).data('name') == 'Самовывоз'){
      $('.fastOrder__form').addClass('pickup');
      $('.address input, .address textarea').val('Самовывоз');
      $('#deliveryConvenientDate').val('01.01.2220');
      $(".total__buttons button").removeClass('disabled');
      $(".total__buttons button").attr('data-tooltip', 'Оформить заказ');
    }else{
      $('.fastOrder__form').removeClass('pickup');
      $('.address input, .address textarea').val('');
      $('#deliveryConvenientDate').val('');
    }
  });
  
  // Действия при выборе зоны внутри варианта доставки на этапе оформления заказа
  $('.zone__radio').click(function(){
    var val = $(this).attr('deliveryid');
    var price = $(this).attr('price');
    var priceBlock = $('.delivery__option[rel='+ val +']').find('.delivery__price').find('.num');
    // Обновление цены
    priceBlock.text(price);
    //
    $('.delivery__radio').each(function(){
      $(this).prop('checked',false);
      if($(this).val() == val){
        $(this).prop('checked',true);
      }else{
        $(this).prop('checked',false);
      }
    });
    // Выбор варианта оплаты при выборе зоны доставки
    var ID = $('input[name="form[delivery][id]"]:checked').val();
    $('.order__payment').hide();
    $('.order__payment[rel="' + ID + '"]').show();
    $('.order__payment[rel="' + ID + '"]').find('input:first').click();
    // Обновление цены с учетом доставки
    var cartSumTotalHide = $('.cartSumTotalHide:eq(0) .num').text().toString().replace(/\s/g, '');
    var newSum = parseInt(cartSumTotalHide) + parseInt(priceBlock.text());
    $('.cartSumTotal .num').text(newSum);
    $('.cartSumDelivery .num').text(price);
  });
}

function OrderScriptsSelect() {
  // Выбор доставки
  $('.delivery__select select').change(function(){
    selectedDelId = $(this).find('option:selected').attr('delid');
    $('.delivery__zoneSelect').hide();
    $('.delivery__zoneSelect[del="'+selectedDelId+'"]').show();
    $('.delivery__zoneSelect option').attr('selected',false)
    $('.delivery__zoneSelect[del="'+selectedDelId+'"] option:first-of-type').attr('selected',true);
    $('.delivery__option .delivery__radio[value="'+selectedDelId+'"]').click();
    WithoutZone = $('div[rel='+ selectedDelId +'] .delivery__radio:checked').attr('pricewithoutzones');
    WithZone = $('div[rel='+ selectedDelId +'] .zone__radio:checked').attr('price');
    if(WithZone >= 0){
      startprice = WithZone;
    }else{
      startprice = WithoutZone;
    }
    $('.changeprice').text(startprice);
    $('.order__payment').hide();
    $('.order__payment[rel="'+ selectedDelId +'"]').show();
    startInputId = $('.delivery__radio:checked').attr('value');
    $('.hiddenRadio .order__payment input').attr('checked',false);
    $('.hiddenRadio .order__payment[rel="'+startInputId+'"] input').each(function(){
      $(this).click();
      return false;
    });
    DeliveryDescription = $('.delivery__radio:checked').next('.delivery__desc').html();
    $('.delivery__description').html(DeliveryDescription);
    $('.order__paymentSelect option:first-child').prop('selected', true);
    // Вывод описания оплаты
    PaymentDescription = $('.hiddenRadio .paymentRadio:checked').next('.payment__desc').html();
    $('.payment__description').html(PaymentDescription);
    if (PaymentDescription == undefined ) {
      $('.payment__description').css("display", "none");
    }else{
      $('.payment__description').css("display", "block");
    }
  });
  
  // Обновление цены и описания при выборе доставки
  $('.delivery__select select').each(function(){
    selectedDelId = $(this).find('option:selected').attr('delid');
    $('.delivery__zoneSelect').hide();
    $('.delivery__zoneSelect[del="'+selectedDelId+'"]').show();
    $('.delivery__zoneSelect option').attr('selected',false)
    $('.delivery__zoneSelect[del="'+selectedDelId+'"] option:first-of-type').attr('selected',true);
    $('.delivery__option .delivery__radio[value="'+selectedDelId+'"]').click();
    WithoutZone = $('div[rel='+ selectedDelId +'] .delivery__radio:checked').attr('pricewithoutzones');
    WithZone = $('div[rel='+ selectedDelId +'] .zone__radio:checked').attr('price');
    if(WithZone >= 0){
      startprice = WithZone;
    }else{
      startprice = WithoutZone;
    }
    $('.changeprice').text(startprice);
    $('.order__payment').hide();
    $('.order__payment[rel="'+ selectedDelId +'"]').show();
    startInputId = $('.delivery__radio:checked').attr('value');
    $('.hiddenRadio .order__payment input').attr('checked',false);
    $('.hiddenRadio .order__payment[rel="'+startInputId+'"] input').each(function(){
      $(this).click();
      return false;
    });
    DeliveryDescription = $('.delivery__radio:checked').next('.delivery__desc').html();
    $('.delivery__description').html(DeliveryDescription);
    $('.order__paymentSelect option:first-child').prop('selected', true);
    // Вывод описания оплаты
    PaymentDescription = $('.hiddenRadio .paymentRadio:checked').next('.payment__desc').html();
    $('.payment__description').html(PaymentDescription);
    if (PaymentDescription == undefined ) {
      $('.payment__description').css("display", "none");
    }else{
      $('.payment__description').css("display", "block");
    }
  });
  
  // Выбор зоны доставки
  $('.delivery__zoneSelect select').change(function(){
    optValue = $(this).find('option:selected').attr('value');
    $('.delivery__zones input[value="'+optValue+'"]').click();
    WithZone = $('.zone__radio:checked').attr('price');
    $('.changeprice').text(WithZone);
  });
  
  // Выбор зоны доставки
  selectedId = $('.delivery__select').find('option').attr('delid');
  $('.delivery__zoneSelect[del="'+ selectedId +'"] select').each(function(){
    optValue = $(this).find('option:first-child').attr('value');
    $('.delivery__zones input[value="'+optValue+'"]').click();
    WithZone = $('.zone__radio:checked').attr('price');
    $('.changeprice').text(WithZone);
  });
  
  
  
  
  // Выбор оплаты
  $('.paymentSelect').change(function(){
    selectedDelId = $(this).find('option:selected').attr('value');
    $('.hiddenRadio .paymentRadio[value="'+selectedDelId+'"]').click();
    PaymentDescription = $('.hiddenRadio .paymentRadio:checked').next('.payment__desc').html();
    $('.payment__description').html(PaymentDescription);
    if (PaymentDescription == undefined ) {
      $('.payment__description').css("display", "none");
    }else{
      $('.payment__description').css("display", "block");
    }
  });
}

// Корзина
function cartQuantity(){
  $('.cartqty').change($.debounce(300, function(){
    var quantity = $(this);
    var qVal = $(this).val();
    if(qVal >= '1'){
      var id = $(this).closest('.cart__item').data('id');
      var data = $('.cartForm').serializeArray();
      data.push({name: 'only_body', value: 1});
      $.ajax({
        data: data,
        cache:false,
        success:function(d){
          quantity.val($(d).find('.cart__item[data-id="' + id + '"] .cartqty').val());
          item = $('.cart__item[data-id="' + id + '"]');
          item.find('.cartPriceTotal span').html($(d).find('.cart__item[data-id="' + id + '"] .cartPriceTotal span').html());
          $('.cart__total').html($(d).find('.cart__total').html());
          cVal = $(d).find('.cart__item[data-id="' + id + '"] .cartqty').attr('max');
          // Вызов функции быстрого заказа в корзине
          $('#startOrder').on('click', function() {
            startOrder();
            return false;
          });
          if(parseInt(qVal) > parseInt(cVal)){
            $('.cart__error').remove();
            $('.cartTable').before('<div class="cart__error warning">Вы пытаетесь положить в корзину товара больше, чем есть в наличии</div>');
            $('.cart__error').fadeIn(500).delay(2500).fadeOut(500, function(){$('.cartErr').remove();});
            $('.cartqty').removeAttr('readonly');
          }
        }
      });
    }else{
      $(this).val('1');
      $(this).trigger('change');
    }
  }));
  quantity()
}

// Удаление товара из корзины
function cartDelete(s){
  var yep = confirm('Вы точно хотите удалить товар из корзины?');
  if(yep == true){
    s.closest('.cart__item').fadeOut();
    url = s.data('href');
    $.ajax({
      url:url,
      cache:false,
      success:function(d){
        $('.cartItems').html($(d).find('.cartItems').html());
        quantity();
        cartQuantity();
        $('#startOrder').on('click', function() {
          startOrder();
          return false;
        });
       }
    });
  }else{
    return false;
  }
}

// Функция быстрого оформления заказа в корзине
function startOrder(){  
  var globalOrder = $('#globalOrder');
  var buttonStartOrder = $('#startOrder');
  var closeOrder = $('#closeOrder');
  var cartTable = $('.cartTable');
  //объект блока куда будет выводиться форма быстрого заказа
  var OrderAjaxBlock = $('#OrderAjaxBlock');
  var urlQuickForm = '/cart/add'; // адрес страницы с формой
  // данные которые отарвятся на сервер чтобы получить только форму быстрого заказа без нижней части и верхней части сайта
  var quickFormData = [
    {name: 'ajax_q', value: 1},
    {name: 'fast_order', value: 1}
  ];
  cartTable.hide();
  globalOrder.show('slow');
  $.ajax({
    type: "POST",
    cache: false,
    url: urlQuickForm,
    data: quickFormData,
    success: function(data) {     
      OrderAjaxBlock.html($(data).find('.fastOrder').wrap('<div></div>').html());
      OrderAjaxBlock.show('slow');
      $('html, body').delay(400).animate({scrollTop : jQuery('#main').offset().top}, 800);
      coupons();
      OrderScripts();
      OrderScriptsSelect();
      showPass();
      $(".form__phone").mask("+7 (999) 999-9999");
      $("#sites_client_phone").mask("+7 (999) 999-9999");
      $('#closeOrder').on('click', function() {
        cartTable.show('slow');
        globalOrder.hide();
        $('html, body').delay(400).animate({scrollTop : jQuery('#main').offset().top}, 800);
        return false;
      });
      // Валидация формы на странице оформления заказа
      $(".total__buttons button").on('click', function(){
        var form = $(".fastOrder__form");
        form.validate({
          errorPlacement: function(error, element) { }
        });
        form.submit();
        return false;      
      });
      // Выключение кнопки оформления заказа если не все поля заполнены
      $(".fastOrder__form [required]").blur(function(){
        if($('.fastOrder__form').valid()) {
          $(".total__buttons button").removeClass('disabled');
          $(".total__buttons button").attr('data-tooltip', 'Оформить заказ');
        } else {
          $(".total__buttons button").addClass('disabled');
          $(".total__buttons button").attr('data-tooltip', 'Заполните все поля');
        }
      });
      // Выключение кнопки оформления заказа если не все поля заполнены
      $(function(){
        if($('.fastOrder__form').valid()) {
          $(".total__buttons button").removeClass('disabled');
          $(".total__buttons button").attr('data-tooltip', 'Оформить заказ');
        }else{
          $(".fastOrder__form input, .fastOrder__form textarea, .fastOrder__form select").removeClass('error');
        }
      });
    }
  });
  return false;
}

// Отправка купона при оформлении заказа
function coupons() {
  var submitBtn = $('.coupon__button');
  var cuponInput = $('#coupon__code');
  var resetBtn = $('.coupon__reset');
  submitBtn.click(function(){
    var url = '/order/stage/confirm';
    var val = cuponInput.val();
    // Получаем данные формы, которые будем отправлять на сервер
    var formData = $('#myform').serializeArray();
    formData.push({name: 'ajax_q', value: 1});
    formData.push({name: 'only_body', value: 1});
    formData.push({name: 'form[coupon_code]', value: val});
    $.ajax({
      type: "POST",
      cache: false,
      url: url,
      data: formData,
      success: function(data) {
        var oldQuickPrice = $('.cartSumTotal:eq(0) .num').text().toString().replace(/\s/g, '')
        var discountBlock = $(data).closest('#myform').find('.discount');
        var discountName = discountBlock.find('.name').text();
        var discountPercent = discountBlock.find('.percent').text();
        var totalBlock = $(data).closest('#myform').find('.total');
        // Записываем название и размер скидки по купону
        $('.total__coupons .total__label span').html(discountName);
        $('.total__coupons .cartSumCoupons').html(discountPercent);
        $('.total__discount').hide();
        $('.total__coupons').show();
        // Получаем новую итоговую стоимость заказа
        var totalSum = totalBlock.find('.total-sum').data('total-sum');
        var deliveryPrice = parseInt($('.delivery__price .changeprice').text());
        var newTotalSum = parseInt(totalSum) + parseInt(deliveryPrice);
        var cartSum = $('.cartSumTotal').data('value');
        // Обновляем значение итоговой стоимости
        $('.cartSumTotal .num').text(newTotalSum);
        $('.cartSumTotal').attr('data-value', newTotalSum);
        $('.cartSumCoupons').attr('data-value', newTotalSum);
        $('.cartSumTotalHide').attr('data-value', newTotalSum);
        $('.cartSumTotalHide .num').text(newTotalSum);
        if (newTotalSum >= cartSum) {
          cuponInput.parent().addClass('error');
          cuponInput.addClass('error');
          cuponInput.parent().removeClass('active');
          cuponInput.val("").attr("placeholder", "Купон неверен");
          submitBtn.html('<i class="icon-right-arrow"></i>');
          $('.total__coupons').hide();
          $('.total__discount').show();
        } else {
          cuponInput.parent().removeClass('error');
          cuponInput.removeClass('error');
          cuponInput.parent().addClass('active');
          submitBtn.html('<i class="material-icons">done</i>');
          $('.total__coupons').show();
        }
      },
      error: function(data){
        console.log("Возникла ошибка: Невозможно отправить форму купона.");
      }
    });
  });
  // Сброс
  resetBtn.on('click', function(){
    $('#coupon__code').val('').trigger('input');
    submitBtn.trigger('click');
    setTimeout(function(){
      $('.total__coupons').hide();
      $('.total__discount').show();
      cuponInput.parent().removeClass('error');
      cuponInput.removeClass('error');
      cuponInput.val("").attr("placeholder", "Введите купон");
      submitBtn.html('<i class="icon-right-arrow"></i>');
    }, 500);
  });
  // Отображение кнопки Сброс
  cuponInput.on('input',function(){
    if($(this).val()) {
      $(this).next('.coupon__reset').addClass('active')
    } else {
      $(this).next('.coupon__reset').removeClass('active')
    }
  });
}

// Дополнительные пункты меню в шапке Перенос пунктов меню
function mainnavHeader(){
  var mainnav = $('.header__menu .mainnav');
  var overMenuExist = mainnav.find('.overflowMenu li').length;
  if(overMenuExist){
    mainnav.find('.overflowMenu li').removeClass('mainnav__replaced');
    mainnav.find('.mainnav__more').remove();
    mainnav.find('.overflowMenu li').each(function(){
      mainnav.find('.mainnav__list').append($(this));
    });
  }
  menuWidth = mainnav.width();
  menuCount = mainnav.find('.mainnav__list li').length + 1;
  var nextCheck = 0;
  var CurrentWidthCounter = 0;
  for(var i=1; i < menuCount;  i++){
    currentWidth = parseInt(Math.ceil(mainnav.find('.mainnav__list li:nth-child('+i+')').width())) + 16;
    nextCheck += currentWidth;
    if(nextCheck > menuWidth){
      var a = i;
      for(a;a < menuCount;a++){
        mainnav.find('.mainnav__list li:nth-child('+ a +')').addClass('mainnav__replaced');
      }
      mainnav.find('.mainnav__replaced').each(function(){
        mainnav.find('.overflowMenu').append($(this));
      });
      mainnav.find('.mainnav__list').append('<li class="mainnav__item mainnav__more"><a class="mainnav__link">Еще...</a></li>');
      menuMorePosition = parseInt(mainnav.find('.mainnav__more').position().left);
      mainnav.find('.mainnav__more').on('click',function(){
        mainnav.find('.overflowMenu').hasClass('active') ? mainnav.find('.overflowMenu').removeClass('active') : mainnav.find('.overflowMenu').addClass('active');
        mainnav.find('.mainnav__list').hasClass('active') ? mainnav.find('.mainnav__list').removeClass('active') : mainnav.find('.mainnav__list').addClass('active');
      });
      $(function($){
        $(document).mouseup(function (e){ 
          var div =  mainnav.find('.overflowMenu.active'); 
          var btn =  mainnav.find('.mainnav__more');
          if (!div.is(e.target) && div.has(e.target).length === 0 && !btn.is(e.target)) {
            div.removeClass('active');
            mainnav.find('.mainnav__list').removeClass('active');
          }
        });
      });
      return false;
    }
  }
}

// Дополнительные пункты меню в шапке Перенос пунктов меню
function mainnavFooter(){
  var mainnav = $('#footer .mainnav');
  var overMenuExist = mainnav.find('.overflowMenu li').length;
  if(overMenuExist){
    mainnav.find('.overflowMenu li').removeClass('mainnav__replaced');
    mainnav.find('.mainnav__more').remove();
    mainnav.find('.overflowMenu li').each(function(){
      mainnav.find('.mainnav__list').append($(this));
    });
  }
  menuWidth = mainnav.width();
  menuCount = mainnav.find('.mainnav__list li').length + 1;
  var nextCheck = 0;
  var CurrentWidthCounter = 0;
  for(var i=1; i < menuCount;  i++){
    currentWidth = parseInt(Math.ceil(mainnav.find('.mainnav__list li:nth-child('+i+')').width())) + 16;
    nextCheck += currentWidth;
    if(nextCheck > menuWidth){
      var a = i;
      for(a;a < menuCount;a++){
        mainnav.find('.mainnav__list li:nth-child('+ a +')').addClass('mainnav__replaced');
      }
      mainnav.find('.mainnav__replaced').each(function(){
        mainnav.find('.overflowMenu').append($(this));
      });
      mainnav.find('.mainnav__list').append('<li class="mainnav__item mainnav__more"><a class="mainnav__link">Еще...</a></li>');
      menuMorePosition = parseInt(mainnav.find('.mainnav__more').position().left);
      mainnav.find('.mainnav__more').on('click',function(){
        mainnav.find('.overflowMenu').hasClass('active') ? mainnav.find('.overflowMenu').removeClass('active') : mainnav.find('.overflowMenu').addClass('active');
        mainnav.find('.mainnav__list').hasClass('active') ? mainnav.find('.mainnav__list').removeClass('active') : mainnav.find('.mainnav__list').addClass('active');
      });
      $(function($){
        $(document).mouseup(function (e){ 
          var div =  mainnav.find('.overflowMenu.active'); 
          var btn =  mainnav.find('.mainnav__more');
          if (!div.is(e.target) && div.has(e.target).length === 0 && !btn.is(e.target)) {
            div.removeClass('active');
            mainnav.find('.mainnav__list').removeClass('active');
          }
        });
      });
      return false;
    }
  }
}

// Функция показать больше для Акции на главной странице
function pdtSales() {
  $('.pdt__sales .owl-carousel').owlCarousel({
    items: 2,
    margin: 32,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    navContainer: '.pdt__sales .owl-nav',
    navText: [ , ],
    dots: false,
    autoHeight: false,
    autoHeightClass: 'owl-height',
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:1},
      320:{items:1},
      481:{items:1},
      641:{items:1},
      768:{items:1},
      992:{items:2},
      1200:{items:2}
    }
  });
}
// Функция показать больше для Акции на главной странице
function pdtOffers() {
  $('#offers .owl-carousel').owlCarousel({
    items: 2,
    margin: 32,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    navContainer: '#offers .owl-nav',
    navText: [ , ],
    dots: false,
    autoHeight: false,
    autoHeightClass: 'owl-height',
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:1},
      320:{items:1},
      481:{items:1},
      641:{items:1},
      768:{items:1},
      992:{items:2, margin: 16},
      1200:{items:2}
    }
  });
}

// Функция показать больше для Товаров на главной странице
function pdtSale() {
  $('.pdt__sale .owl-carousel').owlCarousel({
    items: 4,
    margin: 32,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    navContainer: '.pdt__sale .owl-nav',
    navText: [ , ],
    dots: false,
    autoHeight: false,
    autoHeightClass: 'owl-height',
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:1},
      320:{items:1},
      481:{items:2, margin: 16},
      641:{items:2, margin: 16},
      768:{items:3, margin: 16},
      992:{items:4, margin: 16},
      1200:{items:4}
    }
  });
}
// Функция показать больше для Новинок на главной странице
function pdtNew() {
  $('.pdt__new .owl-carousel').owlCarousel({
    items: 4,
    margin: 32,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    navContainer: '.pdt__new .owl-nav',
    navText: [ , ],
    dots: false,
    autoHeight: false,
    autoHeightClass: 'owl-height',
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:1},
      320:{items:1},
      481:{items:2, margin: 16},
      641:{items:2, margin: 16},
      768:{items:3, margin: 16},
      992:{items:4, margin: 16},
      1200:{items:4}
    }
  });
}
// Функция показать больше для Новинок на главной странице
function pdtBest() {
  $('.pdt__best .owl-carousel').owlCarousel({
    items: 4,
    margin: 32,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    navContainer: '.pdt__best .owl-nav',
    navText: [ , ],
    dots: false,
    autoHeight: false,
    autoHeightClass: 'owl-height',
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:1},
      320:{items:1},
      481:{items:2, margin: 16},
      641:{items:2, margin: 16},
      768:{items:3, margin: 16},
      992:{items:4, margin: 16},
      1200:{items:4}
    }
  });
}

// Функция показать больше для Вы смотрели на главной странице
function recViewed() {
  $('#viewed .owl-carousel').owlCarousel({
    items: 4,
    margin: 32,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    navContainer: '#viewed .owl-nav',
    navText: [ , ],
    dots: false,
    autoHeight: false,
    autoHeightClass: 'owl-height',
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:1},
      320:{items:1},
      481:{items:2, margin: 16},
      641:{items:2, margin: 16},
      768:{items:3, margin: 16},
      992:{items:4, margin: 16},
      1200:{items:4}
    }
  });
}

// Функции для главной страницы
function slideShow() {
  // Слайдер на главной
  var owlS = $('#slideshow .owl-carousel');
  owlS.owlCarousel({
    items: 1,
    loop: true,
    rewind: true,
    lazyLoad: true,
    nav: true,
    navText: [ , ],
    navContainer: '.slider__nav',
    dots: true,
    dotsContainer: '',
    URLhashListener: true,
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 500,
    dotsSpeed: 400,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true
  });
  // Добавить класс анимации из animate.css для анимации слайдов
  function setAnimation ( _elem, _InOut ) {
    // Store all animationend event name in a string.
    // cf animate.css documentation
    var animationEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    _elem.each ( function () {
      var $elem = $(this);
      var $animationType = 'animated ' + $elem.data( 'animation-' + _InOut );
      $elem.addClass($animationType).one(animationEndEvent, function () {
        $elem.removeClass($animationType); // remove animate.css Class at the end of the animations
      });
    });
  }
  // Fired before current slide change
  owlS.on('change.owl.carousel', function(event) {
    setTimeout(function(){
      var currentItem = $('#slideshow .owl-item.active').find('.slider__item').data('slide');
      $('.slider__nav .nav__item').removeClass('active');
      $('.slider__nav .nav__item[data-slide="'+ currentItem +'"]').addClass('active');
    },5);
  });
  // Fired after current slide has been changed
  owlS.on('changed.owl.carousel', function(event) {
    var $currentItem = $('.owl-item', owlS).eq(event.item.index);
    var $elemsToanim = $currentItem.find("[data-animation-in]");
    setAnimation ($elemsToanim, 'in');
  });
  // Навигация в слайдере
  $('#slideshow .slider__nav').on('click', '.nav__item', function(e) {
    owlS.trigger('to.owl.carousel', [$(this).index(), 300]);
    $('#slideshow .slider__nav .nav__item').removeClass('active');
    $(this).addClass('active');
  });
}
// Новости
function newsCarousel() {
  $("#news .owl-carousel").owlCarousel({
    items: 2,
    margin: 32,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    navContainer: '#news .owl-nav',
    navText: [ , ],
    dots: false,
    autoHeight: false,
    autoHeightClass: 'owl-height',
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:1},
      320:{items:1, margin: 16},
      481:{items:1, margin: 16},
      641:{items:2, margin: 16},
      768:{items:2},
      992:{items:2},
      1200:{items:2}
    }
  });
}

// Функция показать больше для Акции на главной странице
function bannerSlide() {
  $('#banners .owl-carousel').owlCarousel({
    items: 1,
    margin: 0,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: false,
    navContainer: '#banners .owl-nav',
    navText: [ , ],
    dots: true,
    autoHeight: true,
    autoHeightClass: 'owl-height',
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100
  });
}

// Открытие Контактов, Меню, Сравнения, Избранного
function OpenMenu() {
  // Закрытие всего при нажатии на темную часть
  $('#overlay').on('click', function(e){
    event.preventDefault();
    if($(this).hasClass('opened')){
      $('div, form, nav').removeClass('opened');
      $('.overflowMenu').removeClass('active');
      $('#sidebar').removeClass('opened');
      setTimeout(function(){
        $('#overlay').removeClass('transparent');
      }, 600);
    }
  });
  
  // Открытие меню
  $('.dropside__open').on('click', function(event){
    event.preventDefault();
    var value = $(this).data('open');
    if ($('.dropside__content[data-open="'+ value +'"]').hasClass('opened')){
      $('#overlay').removeClass('opened');
      $(this).removeClass('opened');
      $(this).parent().parent().removeClass('opened');
      $('.dropside__open').removeClass('opened');
      $('.dropside__content').removeClass('opened');
      $('.dropside__content[data-open="'+ value +'"]').removeClass('opened');
    }else{
      $('#overlay').addClass('opened');
      $(this).addClass('opened');
      $('.dropside__open').removeClass('opened');
      $('.dropside__content').removeClass('opened');
      $(this).parent().parent().addClass('opened');
      $('.dropside__content[data-open="'+ value +'"]').addClass('opened');
      if (value == 'cart' || value == 'compare' || value == 'favorites') {
        $('#sidebar').addClass('opened');
      }
    }
  });
  // Закрытие меню
  $('.dropside__label .icon-cancel').on('click', function(event){
    $('.dropside__content').removeClass('opened');
    $('.dropside__open').removeClass('opened');
    $('#sidebar').removeClass('opened');
    $('#overlay').removeClass('opened');
  });

  // Открытие элементов
  $('.dropdown .dropdown__click').on('click', function(event){
    event.preventDefault();
    if($(this).parents('.dropdown').hasClass('opened')){
      $(this).parents('.dropdown').removeClass('opened');
      $('#overlay').addClass('opened transparent');
    }else{
      $(this).parents('.dropdown').addClass('opened');
      $('#overlay').addClass('opened transparent');
    }
  });

  // Открытие элементов
  $('.dropside__label [data-open="catalog"]').on('click', function(event){
    event.preventDefault();
    $('.dropside__content[data-open="menu"]').removeClass('opened');
    $('.dropside__content[data-open="catalog"]').addClass('opened');
  });
  $('.dropside__label [data-open="menu"]').on('click', function(event){
    event.preventDefault();
    $('.dropside__content[data-open="menu"]').addClass('opened');
    $('.dropside__content[data-open="catalog"]').removeClass('opened');
  });

  // Открытие каталога с сохранением вложенности
  $('.catalog__item .open').click(function(event){
    event.preventDefault();
    if ($(this).closest('.parent').hasClass('opened')) {
      $(this).parent().next('.sub').slideUp(600);
      $(this).closest('.parent').removeClass('opened');
      $(this).closest('.open').removeClass('opened');
    } else {
      $(this).parent().next('.sub').slideDown(600);
      $(this).closest('.parent').addClass('opened');
      $(this).closest('.open').addClass('opened');
    }
  });
  
}

// Открытие каталога 
function OpenMenuCatalog() {
  $('#menu .menu__catalog').off('click').click(function(event){
  event.preventDefault();
    if ($('#menu').hasClass('opened')) {
      $('#menu .dropdown').slideUp(1000);
      $('#menu').removeClass('opened');
      $('#overlay').removeClass('opened transparent');
    } else {
      $('#menu .dropdown').slideDown(1000);
      $('#menu').addClass('opened');
      $('#overlay').addClass('opened transparent');
    }
  });


}

// Много и Мало вместо точного количества
function goodsModRest() {
  $('.goodsModRestValue').each(function(){
    var value = $(this).data('value');
    if (value > 10) {
      $(this).html('Много');
      $(this).css('opacity', '1');
      $(this).parent().addClass('many');
      $(this).parent().removeClass('few');
    }else{
      $(this).html('Мало');
      $(this).css('opacity', '1');
      $(this).parent().addClass('few');
      $(this).parent().removeClass('many');
    }
    if (value == 0) {
      $(this).parent().removeClass('few');
    }
  });
}

// Отсчет даты до окончания акции
function counterDate() {
// Устанавливаем дату обратного отсчета ММ-ДД-ГГ
var end = $('.counter').attr('end');
var countDownDate = new Date(end).getTime();
// Обновление счетчика каждую секунду
var x = setInterval(function() {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  // Вывод
  $('.counter .days span').text(days);
  $('.counter .hours span').text(hours);
  $('.counter .minutes span').text(minutes);
  $('.counter .seconds span').text(seconds);
  // Счетчик завершен
  if (distance < 0) {
    clearInterval(x);
    $('.counter').hide();
  }
}, 1000);
}

// Загрузка основных функций шаблона
$(document).ready(function(){
  OpenMenu();
  AddCart();
  Addto();
  showPass();
  quickViewMod();
  recViewed();
  goodsModRest();
  // Ленивая загрузка
  $(function(){
    const observer = lozad(); // lazy loads elements with default selector as '.lozad'
    observer.observe();
  });
  // Отправка формы по Ctrl+Enter
  $('form').bind('keypress', function(e){
    if((e.ctrlKey) && ((e.which==10)||(e.which==13))) {$(this).submit();}
  // Отправка данных формы по нажатию на Enter в случае если курсор находится в input полях (В некоторых браузерах при нажатии по enter срабатывает клик по первому submit полю, которое является кнопкой назад. Для этого написан этот фикс)
  }).find('input').bind('keypress', function(e){
    if(((e.which==10)||(e.which==13))) { try{$(this.form).submit();} catch(e){} return false; }
  });
  // Маска ввода телефона
  $(".form__phone").mask("+7 (999) 999-9999"); // будет грузится в нескольких местах
  // Возврашаем пользователя на страницу с которой был сделан обратный звонок
  $('.callbackredirect').val(document.location.href);
  // Добавление товара в корзину
  $('body').on('click', '.add-cart', function() {
    var form = $(this).closest('form');
    if ($(this).hasClass('quick')) {
      form.attr('rel', 'quick');
    } else {
      var rel = form.attr('rel');
      if (rel) {
        form.attr('rel', rel.replace('quick', ''));
      }
    }
    form.trigger('submit');
    return (false);
  });
  // Вызов функции быстрого заказа в корзине
  $('#startOrder').on('click', function() {
    startOrder();
    return false;
  });
  // Уведомить при отсутствии товара
  $('.add-notify').on('click', function(){
    $('#fancy__name').val($(this).attr('data-name'));
    $('#fancy__art').val($(this).attr('data-art'));
  });
});

// Запуск основных функций для разных разрешений экрана
$(document).ready(function(){
  if(getClientWidth() > 768){
    quickView();
    OpenMenuCatalog();
    mainnavHeader();
    mainnavFooter();
  }
  if(getClientWidth() < 768){
  }
  if(getClientWidth() > 481 && window.outerHeight < 630){
    $('body').addClass('landscape');
  }else{
    $('body').removeClass('landscape');
  }
});
// Запуск функций при изменении экрана
$(window).resize(function(){
  if(getClientWidth() > 768){
    quickView();
    OpenMenuCatalog();
    mainnavHeader();
    mainnavFooter();
  }
  if(getClientWidth() < 768){
  }
  if(getClientWidth() > 481 && window.outerHeight < 630){
    $('body').addClass('landscape');
  }else{
    $('body').removeClass('landscape');
  }
});




/*
function catalogFull() {
  // Количество товара для показа 
  var GOODS_INDEX = 8;
  // Весь каталог на главной
  if(catalog_full){
    var promises = $.map(catalog_full, function(el){
      return $.ajax(el.href + '?only_body=1&goods_view_type=1')
      .then(function(d){
        var $parentGridContainer = $('.products__container.' + el.id).find('.products__grid');
        var $data = $(d);
        var itemsLength = $data.find('.product__item').length;
        var $newProducts = $data.find('.product__item').parent();
        $newProducts = $newProducts.html();
        if(!$parentGridContainer.find('.products__grid').length){
          $parentGridContainer.append($newProducts);
        }
        if(itemsLength > GOODS_INDEX){
          $parentGridContainer.append($('<div class="pdt__buttons"><button class="button">Показать все</button></div>'))
        }
        lozad().observe();
        AddCart();
        Addto();
        quantity();
      });
    });
    $.when.apply(this, promises)
      .then(function(){
      // catalog_full = null;
      // $('.products__container').show();
    });
  }
  
  // Показать ещё
  $(document).on('click', '.pdt__buttons .button', function() {
    var $btn = $(this);
    if ($btn.hasClass('active')) {
      $btn
        .removeClass('active')
        .text('Показать все')
        .parent().siblings('.product__item').slice(GOODS_INDEX).hide()
    } else {
      $btn
        .addClass('active')
        .text('Скрыть все')
        .parent().siblings('.product__item').show()
    }
  })

}


    
    <!-- Категории каталога -->
    {% IFNOT catalog_full_empty %}
      <script>
        var catalog_full = [];
      </script>
      {% FOR catalog_full %}
        {% IF catalog_full.LEVEL = 0 && catalog_full.GOODS_COUNT > 0  && catalog_full.HIDE=0 %}
        <section class="pdt-{catalog_full.ID} products__container">
          <script>
            catalog_full.push({
              'id': 'pdt-{catalog_full.ID}',
              'href': '{catalog_full.URL}'
            });
          </script>
          <div class="container">
            <div class="preloader"><div class="loading"></div></div>
            <div class="block__title block__nav">
              <a href="{catalog_full.URL}" class="title" title="{catalog_full.NAME}">{catalog_full.NAME}</a>
              <div class="owl-nav"></div>
            </div>
            <div class="products__grid row"></div>
          </div>
        </section>
        {% ENDIF %}
      {% ENDFOR %}
    {% ENDIF %}

*/



      







