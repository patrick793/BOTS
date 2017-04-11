#pragma strict

var textureList : TextureType[];

class TextureType{
	var material : Material;
	var layer : String;
	var uScroll : float;
	var vScroll : float;
	private var uPos : float;
	private var vPos : float;
	function Scroll(){
		uPos += uScroll;
		vPos += vScroll;
		material.SetTextureOffset( layer, Vector2(uPos,vPos) );
	}
}

function Update () {
	for( var tex : TextureType in textureList ){
		tex.Scroll();
	}

}