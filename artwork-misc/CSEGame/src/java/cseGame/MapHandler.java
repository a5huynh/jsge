/*
 * MapHandler.java - MapHandler Class
 *
 * Created on December 7, 2006, 10:52 AM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

package cseGame;

import java.io.*;
import org.xml.sax.*;
import org.xml.sax.helpers.DefaultHandler;
import javax.xml.parsers.SAXParserFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;

/**
 *
 * @author Andrew
 */
public class MapHandler extends DefaultHandler
{
    public static final int LOAD_SPRITES = 1;
    public static final int LOAD_MAP = 2;
    
    private String retData = "";
    
    private int layer = 0;
    
    private int action = 0;
    
    private boolean done = false;
     
    public MapHandler(int action)
    {
        this.action = action;
    }
    
    public void startElement(String namespaceURI, String sName,  String qName, Attributes attrs) throws SAXException
    {   
        if(action == LOAD_MAP)
            generateMap(sName, qName, attrs);
        else if(action == LOAD_SPRITES)
            generateSprites(sName, qName, attrs);
    }
    
    public void endElement(String namespaceURI, String sName,  String qName) throws SAXException
    {
        String eName;
        
        if((eName = sName).equals(""))
            eName = qName; // namespaceAware = false
        
        if(eName.equals("map"))
            done = true;
    }
    
    private void generateMap(String sName,  String qName, Attributes attrs) throws SAXException
    {
        // Element name, Attribute name
        String eName, aName;
        
        if((eName = sName).equals(""))
            eName = qName; // namespaceAware = false
        
        if(eName.equals("layer"))
        {
            if(attrs != null)
            {
                for (int i = 0; i < attrs.getLength(); i++) 
                {
                    if((aName = attrs.getLocalName(i)).equals(""))
                        aName = attrs.getQName(i);
                    
                    if(aName.equals("type"))
                        layer = Integer.parseInt(attrs.getValue(i));
                }
            }
        }
        else if(eName.equals("object"))
        {
            String src = "", width = "", height = "", xPos = "", yPos = "";
            boolean animate = false;
            
            int realX = 0, realY = 0;
                          
            if(attrs != null)
            {
                for (int i = 0; i < attrs.getLength(); i++) 
                {
                    if((aName = attrs.getLocalName(i)).equals(""))
                        aName = attrs.getQName(i);
                    
                    if(aName.equals("src"))
                        src = attrs.getValue(i);
                    else if(aName.equals("x"))
                        xPos = attrs.getValue(i);
                    else if(aName.equals("y"))
                        yPos = attrs.getValue(i);
                    else if(aName.equals("width"))
                        width = attrs.getValue(i);
                    else if(aName.equals("height"))
                        height = attrs.getValue(i);
                    else if(aName.equals("animate"))
                        animate = true;
                }
                
                realX = Integer.parseInt(xPos)*24;
                realY = Integer.parseInt(yPos)*24 - (Integer.parseInt(height) - 24);
                String id = xPos + "x" + yPos + "x" + layer;
                String action = "";
                
                //if(animate)
                    ///action = "onload='game.regObject(\"animate\", new MapObject(\""+id+"\","+xPos+","+yPos+"))'";
                
                //game.regObject("animate", new MapObject("animate0", 0, 0));

                
                retData += "<img id='"+id+"' "+action+" src='"+src+"' style='z-index: "+layer+"; position: absolute; top: "+realY+"px; left: "+realX+"px;'>";
            }
        }        
    }
    
    private void generateSprites(String sName,  String qName, Attributes attrs) throws SAXException
    {
        // Element name, Attribute name
        String eName, aName;
        
        if((eName = sName).equals(""))
            eName = qName; // namespaceAware = false
        
        if(eName.equals("layer"))
        {
            if(attrs != null)
            {
                for (int i = 0; i < attrs.getLength(); i++) 
                {
                    if((aName = attrs.getLocalName(i)).equals(""))
                        aName = attrs.getQName(i);
                    
                    if(aName.equals("type"))
                        layer = Integer.parseInt(attrs.getValue(i));
                }
            }
        }
        else if(eName.equals("sprite"))
        {
            String id = "1", width = "24", height = "24", src = "grass.png", type = "Terrain";
            
            if(attrs != null)
            {
                for (int i = 0; i < attrs.getLength(); i++) 
                {
                    if((aName = attrs.getLocalName(i)).equals(""))
                        aName = attrs.getQName(i);
                    
                    if(aName.equals("id"))
                        id = attrs.getValue(i);
                    else if(aName.equals("src"))
                        src = attrs.getValue(i);
                    else if(aName.equals("width"))
                        width = attrs.getValue(i);
                    else if(aName.equals("height"))
                        height = attrs.getValue(i);
                    else if(aName.equals("type"))
                        type = attrs.getValue(i);
                }
                
                src = "Images/" + type + "/" + src;
                
                retData += ".sp"+id+"{ z-index: "+ layer +"; position: absolute; width: "+width+"px; height: "+height+"px; background-image: url('"+src+"'); }";
            }           
        }
    }
    
    public boolean isDone(){ return done; }
    
    public String toString(){   return retData;   }
}
