<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@page import="cseGame.*" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <link rel="stylesheet" href="cseGameStyle.css" type="text/css" />
    <script type="text/javascript" src="config.js"></script>
    <script type="text/javascript" src="events.js"></script>
    
    <script type="text/javascript" src="ChatScript/chat.js"></script>

    <script type="text/javascript" src="GameScript/cseGameObjs.js"></script>
    <script type="text/javascript" src="GameScript/cseGameInput.js"></script>
    <script type="text/javascript" src="GameScript/cseGameDraw.js"></script>
    <script type="text/javascript" src="GameScript/cseScriptEngine.js"></script>
    <script type="text/javascript" src="GameScript/cseGameEngine.js"></script>    
    <script type="text/javascript" src="GameScript/cseGameMisc.js"></script>    
    
    <style type="text/css">
        <%= new SpriteLoader(getServletContext().getRealPath("GameData/sprites.xml")).toString() %>
        .player1{ background-image: url(Images/player1.png); width: 192px; height: 36px; }
        .player2{ background-image: url(Images/player2.png); width: 192px; height: 36px; }
        .player3{ background-image: url(Images/player3.png); width: 192px; height: 36px; }
        .player4{ background-image: url(Images/player4.png); width: 192px; height: 36px; }        
        .item0{ background-image: url(Images/book.png); width: 24px; height: 24px; }
	.npc1{ background-image: url(Images/joel.png); width: 48px; height: 26px; }
    </style>
    <body onload="loadMap()" scrolling="no">
        <!-- TODO: Load NPC's, other characters here -->
        <div id='jsIncludes'></div>
        
        <!-- Status -->
        <div id='status' class='status'></div>
        
        <!-- Game Map -->
        <div id='scroll' class="map" style="position: absolute; top: 0px;">
            <div id='players' style='position: absolute; z-index: 5;'></div>
            <div id='map' style="position: absolute;">
                <div id="map1" style="position: absolute; top: 0px; left: 0px; width: 480px; height: 480px;"></div>
                <div id="map2" style="position: absolute; top: 0px; left: 480px; width: 480px; height: 480px;"></div>
                <div id="map3" style="position: absolute; top: 0px; left: 960px; width: 480px; height: 480px;"></div>
                <div id="map4" style="position: absolute; top: 480px; left: 0px; width: 480px; height: 480px;"></div>
                <div id="map5" style="position: absolute; top: 480px; left: 480px; width: 480px; height: 480px;"></div>
                <div id="map6" style="position: absolute; top: 480px; left: 960px; width: 480px; height: 480px;"></div>
                <div id="map7" style="position: absolute; top: 960px; left: 0px; width: 480px; height: 480px;"></div>
                <div id="map8" style="position: absolute; top: 960px; left: 480px; width: 480px; height: 480px;"></div>
                <div id="map9" style="position: absolute; top: 960px; left: 960px; width: 480px; height: 480px;"></div>
            </div>
        </div>
        
        <!-- User Pack (Inventory) -->
        <div id='packDND' style='z-index: 100; position: absolute; width: 40px; height: 40px;'></div>
	<div id='pack' class='packBorder'>
            <% for(int y = 0; y < 6; y++) {
                    for(int x = 0; x < 5; x++)
                        out.println("<div id='packSpot"+ (y*5 +x) +"' style='z-index: 5; position: absolute; margin: 8px; top: "+y*40+"px; left: "+x*40+"px; width: 40px; height: 40px;'></div>");
                } 
            %>
        </div>   
        
        <!-- NPC Chat -->
        <!-- 
        <div id='npcChat' class='npcChat'>
            <div style='float: right; padding: 5px 10px;'><a href=''>Close</a></div>
            <table cellspacing='0' cellpadding='0'>
                <tr>
                    <td width='20%' align='center'><img border='0' src='Images/bob.gif'></td>
                    <td valign='top'>
                        <div style='padding-top: 15px'>
                            Hello Adventurer, I am Bob the dinosaur.<p>
                            Welcome to Tutorial Island, where you'll learn the basics of MiniRPG.
                        </div>
                    </td>
                    </tr>
                <tr><td colspan='2' style='padding: 5px 10px; text-align: right'><a href=''>More -></a></td></tr>
            </table>
        </div>
        -->
        
        <!-- Tooltip -->
      	<div id='ttip' class='ttip'>
            <div id='ttHeader' class='ttHeader'></div>
            <div id='ttInfo' class='ttInfo'></div>
	</div>
        
        <!-- Heads-Up Display -->
        <div id='hudStatus' class='hudStatus'></div>
        
        <!-- Script Storage (Storage area for scripts.) -->
        <div id='scriptStorage' style='visibility: hidden'></div>
        
        <!-- Context Menu -->
	<div id='ctxtMenu' class='ctxtMenu'>
		<div class='ctxtHeader'>Options</div>
		<div class='ctxtDivider'></div>
		<div id='ctxtOptions'></div>
	</div>        
        
        <!-- Console/Chat Window -->
        <div id="console" class="console"></div>
        <div id="cInputDiv" class="cInputDiv">
            <input type="text" id="consoleInput" class="consoleInput" maxlength="60" disabled>
        </div>
        
    </body>
</html>
