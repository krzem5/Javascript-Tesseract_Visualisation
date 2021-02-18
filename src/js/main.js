var CUBE_MATRIX=[],ROT_ANGLE=0
//////////////////////////////////////////////////
function create_cube(s){
	var m=[]
	m.push([-s,-s,-s,s])
	m.push([s,-s,-s,s])
	m.push([s,s,-s,s])
	m.push([-s,s,-s,s])
	m.push([-s,-s,s,s])
	m.push([s,-s,s,s])
	m.push([s,s,s,s])
	m.push([-s,s,s,s])
	m.push([-s,-s,-s,-s])
	m.push([s,-s,-s,-s])
	m.push([s,s,-s,-s])
	m.push([-s,s,-s,-s])
	m.push([-s,-s,s,-s])
	m.push([s,-s,s,-s])
	m.push([s,s,s,-s])
	m.push([-s,s,s,-s])
	return m
}
function cube_lines(mc){
	var lns=[]
	for (var ji of [0,1,2,3]){
		var j=[ji,(ji+1)%4]
		lns.push([mc[j[0]],mc[j[1]]])
		lns.push([mc[j[0]+4],mc[j[1]+4]])
		lns.push([mc[j[0]+8],mc[j[1]+8]])
		lns.push([mc[j[0]+12],mc[j[1]+12]])
		j=[ji,(ji+4)%8]
		lns.push([mc[j[0]],mc[j[1]]])
		lns.push([mc[j[0]+8],mc[j[1]+8]])
		j=[ji,(ji+8)%16]
		lns.push([mc[j[0]],mc[j[1]]])
		lns.push([mc[j[0]+4],mc[j[1]+4]])
	}
	return lns
}
function to_3D(mc){
	var mo=[]
	for (var p of mc){
		var w=1/(2-p[3])
		var m3d=[
			[w,0,0,0],
			[0,w,0,0],
			[0,0,w,0]
		]
		var m3d=matrix_to_point(mult_mat(m3d,point_to_matrix(p)))
		mo.push(m3d)
	}
	return mo
}
function to_2D(mc){
	var mo=[]
	for (var p of mc){
		var m2d=[
			[1,0,0],
			[0,1,0]
		]
		var m2d=matrix_to_point(mult_mat(m2d,point_to_matrix(p)))
		mo.push(m2d)
	}
	return mo
}
function point_to_matrix(p){
	var mo=[]
	for (var i=0;i<p.length;i++){mo.push([p[i]])}
	return mo
}
function matrix_to_point(m){
	var po=[]
	for (var i=0;i<m.length;i++){po.push(m[i][0])}
	return po
}
function scale_points(mc,s){
	var mo=[]
	for (var p of mc){
		var np=[]
		for (var k of p){
			np.push(k*s)
		}
		mo.push(np)
	}
	return mo
}
function rotate_matrix(mc,axis,angle){
	angle=angle*(Math.PI/180)
	var mm
	if (axis=="x"){
		mm=[[1,0,0],[0,Math.cos(angle),-Math.sin(angle)],[0,Math.sin(angle),Math.cos(angle)]]
	}
	else if (axis=="y"){
		mm=[[Math.cos(angle),0,Math.sin(angle)],[0,1,0],[-Math.sin(angle),0,Math.cos(angle)]]
	}
	else if (axis=="z"){
		mm=[[Math.cos(angle),-Math.sin(angle),0],[Math.sin(angle),Math.cos(angle),0],[0,0,1]]
	}
	else if (axis=="zw"){
		mm=[[1,0,0,0],[0,1,0,0],[0,0,Math.cos(angle),-Math.sin(angle)],[0,0,Math.sin(angle),Math.cos(angle)]]
	}
	else if (axis=="xy"){
		mm=[[Math.cos(angle),-Math.sin(angle),0,0],[Math.sin(angle),Math.cos(angle),0,0],[0,0,1,0],[0,0,0,1]]
	}
	var mo=[]
	for (var p of mc){
		mo.push(matrix_to_point(mult_mat(mm,point_to_matrix(p))))
	}
	return mo
}
function mult_mat(ma,mb){
	var ra=ma.length
	var ca=ma[0].length,cb=mb[0].length
	var mo=Array(ra)
	for (var i=0;i<ra;i++){mo[i]=Array(cb)}
	for (var bci=0;bci<cb;bci++){
		for (var ri=0;ri<ra;ri++){
			var sum=0
			for (var ci=0;ci<ca;ci++){
				sum+=ma[ri][ci]*mb[ci][bci]
			}
			mo[ri][bci]=sum
		}
	}
	return mo
}
let cnv,ctx;
document.addEventListener("DOMContentLoaded",()=>{
	var cnv=document.createElement("canvas");
	cnv.width=800;
	cnv.height=800;
	document.body.appendChild(cnv);
	cnv.style.position="absolute";
	cnv.style.top="0px";
	cnv.style.left="0px";
	cnv.style.backgroundColor="#000000";
	document.body.style.backgroundColor="#000000";
	ctx=cnv.getContext("2d");
	ctx.strokeStyle="#ffffff";
	ctx.fillStyle="#ff0000";
	ctx.lineWidth=5;
	ctx.lineCap="round";
	CUBE_MATRIX=create_cube(1);
	requestAnimationFrame(draw);
},false);
function draw(){
	ctx.clearRect(0,0,800,800);
	ctx.translate(400,400);
	var m=rotate_matrix(CUBE_MATRIX,"zw",ROT_ANGLE);
	m=to_3D(m);
	m=rotate_matrix(m,"y",25);
	m=rotate_matrix(m,"x",5);
	m=to_2D(m);
	m=scale_points(m,100);
	for (var l of cube_lines(m)){
		ctx.beginPath();
		ctx.moveTo((l[0][0]),(l[0][1]));
		ctx.lineTo((l[1][0]),(l[1][1]));
		ctx.stroke();
	}
	for (var p of m){
		ctx.fillRect(p[0]-3,p[1]-3,6,6);
	}
	ROT_ANGLE-=0.1;
	ctx.translate(-400,-400);
	requestAnimationFrame(draw);
}
