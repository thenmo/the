function dhdatagrid(){
	//author:dh20156; Download by http://www.jb51.net 
	this.callname = "dhdg";
	this.width = 500;
	this.height = 200;
	this.rid = "dhdatagrid";
	this.multiple = false;
	this.columns = [];
	this.colwidth = [];
	this.data = [];
	this.dblclick_fun = function(){}
	this.contextmenu_fun = function(){}
	this.parentNode = document.body;

	var dh = this;
	var framediv = null;
	var zerobj = null;
	var leftobj = null;
	var titleobj = null;
	var dataobj = null;
	var hbar = null;
	var vbar = null;
	var bgbar = null;

	var isMSIE = (navigator.appName == "Microsoft Internet Explorer");

	//改变列宽初始位置
	var ml = 0;
	//改变列宽对象初始宽度
	var ow = 0;
	//改变列宽对象
	var tdobj = null;
	//当前选定行索引
	var nowrow = null;
	//是否更改垂直滚动条位置
	var changeposv = true;

	//全选
	this.selectall = function(checked){
		var objbox = document.getElementsByName("dhdgchkbox");
		var objboxl = objbox.length;
		for(var i=0;i<objboxl;i++){
			objbox[i].checked = checked;
		}
	}

	this.init = function(){
		//init the data 初始数据
		var dgc = "";
		var avgw = this.width-100
		avgw = Math.floor(avgw/this.columns.length);
		if(this.columns.length>0){
			dgc = '<tr><td class="firstcolumn">&nbsp;</td>';
			if(this.multiple){
				dgc += '<td class="column" style="width:30px;text-align:center;padding:0;text-indent:0;text-align:center;"><input type="checkbox" style="margin:0;" onclick="'+this.callname+'.selectall(this.checked);"></td>';
			}
			for(var cc=0;cc<this.columns.length;cc++){
				if(this.colwidth.length>0){
					dgc += '<td class="column" width="'+this.colwidth[cc]+'" onmouseover="'+this.callname+'.over(this);" onmouseout="'+this.callname+'.out(this);" onmousemove="'+this.callname+'.cc(event,this);" onmousedown="'+this.callname+'.rsc_d(event,this);" onmouseup="'+this.callname+'.mouseup(this);">'+this.columns[cc]+'<span class="arrow"></span></td>';
				}else{
					dgc += '<td class="column" width="'+avgw+'" onmouseover="'+this.callname+'.over(this);" onmouseout="'+this.callname+'.out(this);" onmousemove="'+this.callname+'.cc(event,this);" onmousedown="'+this.callname+'.rsc_d(event,this);" onmouseup="'+this.callname+'.mouseup(this);">'+this.columns[cc]+'<span class="arrow"></span></td>';
				}
			}
			dgc += '<td class="lastcolumn">&nbsp;</td></tr>';
		}

		var dgs = "";
		var dgd = "";
		if(this.data.length>0){
			//第一列
			dgs = '<tr><td>&nbsp;</td></tr>';
			for(var r=0;r<this.data.length;r++){
				dgs += '<tr><td>'+(r+1)+'</td></tr>';
				dgd += '<tr onmouseover="'+this.callname+'.dataover(this);" onmouseout="'+this.callname+'.dataout(this);" ondblclick="'+this.callname+'.dblclick_fun(this);" oncontextmenu="'+this.callname+'.contextmenu_fun(this,event);"><td class="firstcolumn">&nbsp;</td>';
				if(this.multiple){
					dgd += '<td style="width:30px;text-align:center;overflow:hidden;padding:0;text-align:center;"><input type="checkbox" style="margin:0;" name="dhdgchkbox"></td>';
				}
				for(var c=0;c<this.data[r].length;c++){
					if(this.colwidth.length>0){
						dgd += '<td width="'+this.colwidth[c]+'">'+this.data[r][c]+'</td>';
					}else{
						dgd += '<td width="'+avgw+'">'+this.data[r][c]+'</td>';
					}
				}
				dgd += '<td class="lastdata">&nbsp;</td></tr>';
			}
			if(dgc==""){
				dgc = '<tr><td class="firstcolumn">&nbsp;</td>';
				if(this.multiple){
					dgc += '<td class="column" style="width:30px;text-align:center;padding:0;text-indent:0;text-align:center;"><input type="checkbox" style="margin:0;" onclick="'+this.callname+'.selectall(this.checked);"></td>';
				}
				for(var dc=0;dc<this.data[0].length;dc++){
					if(this.colwidth.length>0){
						dgc += '<td class="column" width="'+this.colwidth[dc]+'" onmouseover="'+this.callname+'.over(this);" onmouseout="'+this.callname+'.out(this);" onmousemove="'+this.callname+'.cc(event,this);" onmousedown="'+this.callname+'.rsc_d(event,this);" onmouseup="'+this.callname+'.mouseup(this);">Expr'+(dc+1)+'<span class="arrow"></span></td>';
					}else{
						dgc += '<td class="column" width="'+avgw+'" onmouseover="'+this.callname+'.over(this);" onmouseout="'+this.callname+'.out(this);" onmousemove="'+this.callname+'.cc(event,this);" onmousedown="'+this.callname+'.rsc_d(event,this);" onmouseup="'+this.callname+'.mouseup(this);">Expr'+(dc+1)+'<span class="arrow"></span></td>';
					}
				}
				dgc += '<td class="lastcolumn">&nbsp;</td></tr>';
			}
		}

		//dhdatagrid frame 框架
		var dgframe = document.createElement("DIV");
		dgframe.id = this.rid;
		dgframe.style.width = this.width;
		dgframe.style.height = this.height;
		dgframe.onmousedown = function(e){e=e||window.event;getrow(e);}
		dgframe.onmousemove = function(e){e=e||window.event;rsc_m(e);}
		if(document.attachEvent){
			document.attachEvent("onmouseup",rsc_u);
		}else{
			document.addEventListener("mouseup",rsc_u,false);
		}
		dgframe.oncontextmenu = function(){return false}
		dgframe.onselectstart = function(){return false}
		ae(dgframe);

		//dhdatagrid zero point 零点
		var dgzero = "<div id=\"zero\"></div>"

		//dhdatagrid slidecolumn 第一列
		var dgslide = "<table cellpadding=\"0\" cellspacing=\"0\" id=\"slidecolumn\">"+dgs+"</table>";

		//dhdatagrid column 标题栏
		var dgcolumn = "<table cellpadding=\"0\" cellspacing=\"0\" id=\"titlecolumn\">"+dgc+"</table>";

		//dhdatagrid data 数据
		var dgdata = "<table cellpadding=\"0\" cellspacing=\"0\" id=\"datacolumn\">"+dgc+dgd+"</table>";

		//dhdatagrid hbar 水平滚动条
		var dghbar = document.createElement("DIV");
		dghbar.id = "hbar";
		dghbar.style.position = "absolute";
		dghbar.style.width = "100%";
		dghbar.style.height = "17px";
		dghbar.style.top = this.height-17;
		dghbar.style.overflowX = "auto";
		dghbar.style.zIndex = "10";
		dghbar.onscroll = function(){scrh();}
		dghbar.innerHTML = "<div style=\"width:100%;height:1px;overflow-y:hidden;\">&nbsp;</div>";

		//dhdatagrid vbar 垂直滚动条
		var dgvbar = document.createElement("DIV");
		dgvbar.id = "vbar";
		dgvbar.style.position = "absolute";
		dgvbar.style.width = "17px";
		dgvbar.style.height = "100%";
		dgvbar.style.left = this.width-17;
		dgvbar.style.overflowY = "auto";
		dgvbar.style.zIndex = "10";
		dgvbar.onscroll = function(){scrv();}
		dgvbar.innerHTML = "<div style=\"width:1px;height:100%;overflow-x:hidden;\">&nbsp;</div>";

		//dhdatagrid bgbar 滚动条背景
		var dgbgbar = document.createElement("DIV");
		dgbgbar.id = "bgbar";
		dgbgbar.style.background = "buttonface";
		dgbgbar.style.position = "absolute";
		dgbgbar.style.width = "100%";
		dgbgbar.style.height = "17px";
		dgbgbar.style.top = this.height-17;
		dgbgbar.style.overflowX = "auto";
		dgbgbar.style.zIndex = "9";
		dgbgbar.style.display = "none";
		dgbgbar.innerHTML = "&nbsp;";

		//appendChild
		dgframe.innerHTML = dgzero+dgslide+dgcolumn+dgdata;
		dgframe.appendChild(dghbar);
		dgframe.appendChild(dgvbar);
		dgframe.appendChild(dgbgbar);

		this.parentNode.appendChild(dgframe);

		if(document.attachEvent){
			document.attachEvent("onkeydown",updown);
		}else{
			document.addEventListener("keydown",updown,false);
		}

		framediv = dgframe;
		zerobj = document.getElementById("zero");
		leftobj = document.getElementById("slidecolumn");
		titleobj = document.getElementById("titlecolumn");
		dataobj = document.getElementById("datacolumn");
		hbar = dghbar;
		vbar = dgvbar;
		bgbar = dgbgbar;

		var btt = getCurrentStyle(framediv,"borderTopWidth");
		var btr = getCurrentStyle(framediv,"borderRightWidth");
		var btb = getCurrentStyle(framediv,"borderBottomWidth");
		var btl = getCurrentStyle(framediv,"borderLeftWidth");
		var fh = getCurrentStyle(framediv,"height");
		var zh = getCurrentStyle(zerobj,"height");
		var zbt = getCurrentStyle(zerobj,"borderTopWidth");
		var zbb = getCurrentStyle(zerobj,"borderBottomWidth");

		if(isMSIE){
			vbar.style.left = parseInt(vbar.style.left)-parseInt(btr)-parseInt(btl);
		}else{
			framediv.style.height = parseInt(fh)-parseInt(btb)-parseInt(btt);
			zerobj.style.height = parseInt(zh)-parseInt(zbb)-parseInt(zbt);
		}

		hbar.style.top = parseInt(hbar.style.top)-parseInt(btb)-parseInt(btt);
		bgbar.style.top = parseInt(bgbar.style.top)-parseInt(btb)-parseInt(btt);

		this.setwh();

	}
	//获得当前样式
	function getCurrentStyle(oElement, sProperty) {   
		if(oElement.currentStyle){   
			return oElement.currentStyle[sProperty];   
		}else if(window.getComputedStyle){   
			sProperty = sProperty.replace(/([A-Z])/g, "-$1").toLowerCase();   
			return window.getComputedStyle(oElement, null).getPropertyValue(sProperty);   
		}else{   
			return null;   
		}   
	}
	//设置块滚动条
	this.setwh = function(){
		hbar.style.display = "block";
		vbar.style.display = "block";
		hbar.childNodes[0].style.width = dataobj.offsetWidth;
		vbar.childNodes[0].style.height = dataobj.offsetHeight;

		if(hbar.childNodes[0].offsetWidth<=hbar.offsetWidth){
			hbar.style.display = "none";
		}else{
			hbar.style.display = "block";
		}

		if(vbar.childNodes[0].offsetHeight<=vbar.offsetHeight){
			vbar.style.display = "none";
		}else{
			vbar.style.display = "block";
		}

		if(hbar.childNodes[0].offsetWidth>hbar.offsetWidth && vbar.childNodes[0].offsetHeight>vbar.offsetHeight && changeposv){
			bgbar.style.display = "block";
			hbar.style.width = hbar.offsetWidth-17;
			vbar.style.height = vbar.offsetHeight-17;
			vbar.childNodes[0].style.height = vbar.childNodes[0].offsetHeight+17;
			changeposv = false;
		}

		if(hbar.childNodes[0].offsetWidth<=hbar.offsetWidth+17 && !changeposv){
			bgbar.style.display = "none";
			hbar.childNodes[0].style.width = 0;
			hbar.style.width = hbar.offsetWidth+17;
			vbar.style.height = vbar.offsetHeight+17;
			changeposv = true;
			if(vbar.offsetHeight-dataobj.offsetHeight>dataobj.offsetTop && isMSIE){
				leftobj.style.top = leftobj.offsetTop+17;
				dataobj.style.top = dataobj.offsetTop+17;
			}
		}
	}

	//鼠标滚轮，列表滚动事件
	function mwEvent(e){
		e=e||window.event;
		if(e.wheelDelta<=0 || e.detail>0){
			vbar.scrollTop += 18;
		}else {
			vbar.scrollTop -= 18;
		}
	}
	function ae(obj){
		if(document.attachEvent){
			obj.attachEvent("onmousewheel",mwEvent);
		}else{
			obj.addEventListener("DOMMouseScroll",mwEvent,false);
		}
	}

	//滚动条事件
	function scrv(){
		leftobj.style.top = -(vbar.scrollTop);
		dataobj.style.top = -(vbar.scrollTop);
	}

	function scrh(){
		titleobj.style.left = -(hbar.scrollLeft);
		dataobj.style.left = -(hbar.scrollLeft);
	}

	//选择行
	function getrow(e){
		e=e||window.event;
		var esrcobj = e.srcElement?e.srcElement:e.target;
		if(esrcobj.parentNode.tagName=="TR"){
			var epobj = esrcobj.parentNode;
			var eprowindex = epobj.rowIndex;
			if(eprowindex!=0){
				if(nowrow!=null){
					dataobj.rows[nowrow].className = "";
				}
				dataobj.rows[eprowindex].className = "selectedrow";
				nowrow = eprowindex;
			}
		}
	}

	//更改列宽
	this.rsc_d = function(e,obj){
		var px = isMSIE?e.offsetX:e.layerX-obj.offsetLeft;
		if(px>obj.offsetWidth-6 && px<obj.offsetWidth){
			e=e||window.event;
			obj=obj||this;
			ml = e.clientX;
			ow = obj.offsetWidth;
			tdobj = obj;
			if(obj.setCapture){
				obj.setCapture();
			}else{
				e.preventDefault();
			}
		}else{
			if(nowrow!=null){
				dataobj.rows[nowrow].className = "";
			}
			if(obj.getAttribute("sort")==null){
				obj.setAttribute("sort",0);
			}
			var sort = obj.getAttribute("sort");
			if(sort==1){
				dgsort(obj,true);
				obj.setAttribute("sort",0);
			}else{
				dgsort(obj,false);
				obj.setAttribute("sort",1);
			}
			obj.className = "sortdown";
		}
	}
	this.mouseup = function(obj){
		obj.className = "over";
	}
	function rsc_m(e){
		if(tdobj!=null){
			e=e||window.event;
			var newwidth = ow-(ml-e.clientX);
			if(newwidth>5){
				tdobj.style.width = newwidth;
				dataobj.rows[0].cells[tdobj.cellIndex].style.width = newwidth;
			}else{
				tdobj.style.width = 5;
				dataobj.rows[0].cells[tdobj.cellIndex].style.width = 5;
			}
			dh.setwh();
			scrh();
		}
	}
	function rsc_u(e){
		if(tdobj!=null){
			e=e||window.event;
			var newwidth = ow-(ml-e.clientX);
			if(newwidth>5){
				tdobj.style.width = newwidth;
				dataobj.rows[0].cells[tdobj.cellIndex].style.width = newwidth;
			}else{
				tdobj.style.width = 5;
				dataobj.rows[0].cells[tdobj.cellIndex].style.width = 5;
			}
			if(tdobj.releaseCapture){
				tdobj.releaseCapture();
			}
			ml = 0;
			ow = 0;
			tdobj = null;
		}
		dh.setwh();
		scrh();
	}

	this.cc = function(e,obj){
		var px = isMSIE?e.offsetX:e.layerX-obj.offsetLeft;
		if(px>obj.offsetWidth-6 && px<obj.offsetWidth){
			obj.style.cursor = "col-resize";
		}else{
			obj.style.cursor = "default";
		}
	}

	this.over = function(obj){
		obj.className = "over";
	}

	this.out = function(obj){
		obj.className = "column";
	}

	this.dataover = function(obj){
		if(obj.rowIndex!=nowrow){
			obj.className = "dataover";
		}
	}

	this.dataout = function(obj){
		if(obj.rowIndex!=nowrow){
			obj.className = "";
		}
	}

	//键盘Up & Down事件
	function updown(e){
		e=e||window.event;
		c=e.which||e.keyCode;
		var rl = dh.data.length;
		switch(c){
			case 38://Up;
				if(nowrow!=null && nowrow>1){
					vbar.scrollTop -= 18;
					dataobj.rows[nowrow].className = "";
					nowrow -= 1;
					dataobj.rows[nowrow].className = "selectedrow";
				};
				if(isMSIE){
					e.keyCode = 0;
				}
				break;
			case 40://Down;
				if(nowrow!=null && nowrow<rl){
					vbar.scrollTop += 18;
					dataobj.rows[nowrow].className = "";
					nowrow += 1;
					dataobj.rows[nowrow].className = "selectedrow";
				};
				if(isMSIE){
					e.keyCode = 0;
				}
				break;
			case 13://enter;
				if(nowrow!=null){
					dh.dblclick_fun(dataobj.rows[nowrow]);
				};
				if(isMSIE){
					e.keyCode = 0;
				}
				break;
			default:break;
		}
	}

	function dti(s){
		var tmpstr = "";
		var n = 0;
		var tmp = s.split(/\./);
		if(tmp.length>0){
			tmpstr = tmp[0]+"."+tmp.slice(1,tmp.length).join("");
		}else{
			tmpstr = s
		}
		var a = tmpstr.match(/(\d+\.\d+)|(\d+)/g);
		for(var i=0;i<a.length;i++){
			if(a[i].length<2){
				a[i] = "0"+a[i];
			}
		}
		n = a.join("");
		return n;
	}

	//排序
	function dgsort(obj,asc){
		var rl = dh.data.length;
		var ci = obj.cellIndex;
		var rowsobj = [];
		for(var i=1;i<dataobj.childNodes[0].rows.length;i++){
			rowsobj[i-1] = dataobj.childNodes[0].rows[i];
		}
		rowsobj.sort(function(trObj1,trObj2){
				if(!isNaN(trObj1.cells[ci].innerHTML.charAt(0)) && !isNaN(trObj2.cells[ci].innerHTML.charAt(0))){
					if(asc){
						return dti(trObj1.cells[ci].innerHTML)-dti(trObj2.cells[ci].innerHTML);
					}else{
						return dti(trObj2.cells[ci].innerHTML)-dti(trObj1.cells[ci].innerHTML);
					}
				}else{
					if(asc){
						return trObj1.cells[ci].innerHTML.localeCompare(trObj2.cells[ci].innerHTML);
					}else{
						return trObj2.cells[ci].innerHTML.localeCompare(trObj1.cells[ci].innerHTML);
					}
				}
			});
		for(var i=0;i<rowsobj.length;i++){
			dataobj.childNodes[0].appendChild(rowsobj[i]);
		}
		rowsobj = null;
		for(var c=(dh.multiple)?2:1;c<obj.parentNode.cells.length-1;c++){
			obj.parentNode.cells[c].childNodes[1].innerHTML = "";
		}
		if(asc){
			obj.childNodes[1].innerHTML = "▲";
		}else{
			obj.childNodes[1].innerHTML = "▼";
		}
	}

	//查找
	this.findkey = function(keys){
		//e=e || window.event; e=e.which || e.keyCode;
		keys = keys.toLowerCase();
		if(keys.replace(/\s/g,"").length>0){
			var rowsobjT = [];
			var rowsobjB = [];
			for(var i=0;i<this.data.length;i++){
				if(-1 != dataobj.childNodes[0].rows[i+1].innerHTML.replace(/<td[^>]*>|<\/td>/ig,"").toLowerCase().indexOf(keys)){
					rowsobjT[rowsobjT.length] = dataobj.childNodes[0].rows[i+1];
				}else{
					rowsobjB[rowsobjB.length] = dataobj.childNodes[0].rows[i+1];
				}
			}
			if(rowsobjT.length>0){
				if(nowrow!=null){
					dataobj.childNodes[0].rows[nowrow].className = "";
				}
				var fobj = rowsobjT.concat(rowsobjB);
				for(var i=0;i<fobj.length;i++){
					dataobj.childNodes[0].appendChild(fobj[i]);
				}
				fobj = null;
			}
			rowsobjT = null;
			rowsobjB = null;
		}
	}

	//加载数据
	this.setdata = function(arrdata){
		if(arrdata && arrdata.length>0){
			framediv.innerHTML = "";
			this.parentNode.removeChild(framediv);
			this.data = arrdata;
			changeposv = true;
			nowrow = null;
			this.init();
		}
	}
}