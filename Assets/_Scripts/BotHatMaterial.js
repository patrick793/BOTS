#pragma strict

public enum MaterialSourceType { Bot_Material, Bot_Color }
public var materialSource : MaterialSourceType;

public function changeMaterial( bot : Bot ){
	
	var mat : Material;
	if( materialSource == MaterialSourceType.Bot_Material ){
		renderer.material = bot.limbArmR.renderer.material;
		
		
	}else if( materialSource == MaterialSourceType.Bot_Color ){
		mat = new Material( renderer.material );
		mat.color = bot.color;
		renderer.material = mat;
		
		
	}
	
}


/**
* Recursive function to change the material of all of an object's children to match the bot Color
*/
public static function changeAllMaterials( obj : GameObject, bot : Bot ){
	var bHM : BotHatMaterial = obj.GetComponent(BotHatMaterial);
	if( bHM != null )
		bHM.changeMaterial( bot );
	for( var i : int = 0; i < obj.transform.childCount; i++ ){
		changeAllMaterials( obj.transform.GetChild(i).gameObject, bot );
	}
}