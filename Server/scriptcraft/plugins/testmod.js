
//
// Min første Minecraft Mod!
//

registerEvent = events.on;

function main()
{
	echo ("Hej!");

	registerCommand("hej", cmdHej);

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