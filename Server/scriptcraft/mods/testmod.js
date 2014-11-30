
//
// Min første Minecraft Mod!!!
//

function main()
{
	echo ("Hej!");

	registerCommand("hej", cmdHej);
}

function cmdHej(parameters, player)
{
	echo(player, "Hej med dig!");
}

main();
