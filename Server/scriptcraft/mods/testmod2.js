
//
// Min anden Minecraft Mod!
//

registerEvent = events.on;

function main()
{
	echo ("Hej2!");

	registerCommand("hej2", cmdHej);

	registerEvent(Packages.net.canarymod.hook.player.ConnectionHook, onPlayerJoin);
}

function cmdHej(parameters, player)
{
	echo(player, "Hej med dig!");
}


function onPlayerJoin( event )
{
    echo(event.player, 'Velkommen til min server, ' + event.player.name );
}

main();
