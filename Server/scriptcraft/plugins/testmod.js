
//
// Min første Minecraft Mod!
//

registerEvent = events.on;

function main()
{
	echo ("Hej!");

	//registerCommand("hej", cmdHej);

//	registerEvent("player.PlayerJoinEvent", onPlayerJoin);
	registerEvent(Packages.net.canarymod.hook.player.ConnectionHook, onPlayerJoin);
}

function cmdHej(parameters, player)
{
	player.sendMessage("Hej med dig!");
}


function onPlayerJoin( event ) {
    echo(event.player, 'Velkommen til min server, ' + event.player.name );
}

main();