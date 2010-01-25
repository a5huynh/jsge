/*
 * SpriteLoader.java
 *
 * Created on December 23, 2006, 1:53 PM
 *
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
public class SpriteLoader
{
    private SpriteXMLReader sLoad = new SpriteXMLReader();
    
    private String retData = "";

    /** Creates a new instance of SpriteLoader */
    // Load Sprites
    public SpriteLoader(String path)
    {
        SAXParserFactory factory = SAXParserFactory.newInstance();
        try 
        {                   
            // Parse the input
            InputStream istream = new FileInputStream(path);
            SAXParser saxParser = factory.newSAXParser();
            saxParser.parse(istream, sLoad);

        } catch (Throwable t){ retData += t.toString(); }        
    }
    
    public String toString()
    {
        retData += sLoad.toString();
        return retData;
    }
}

class SpriteXMLReader extends DefaultHandler
{   
    private String retData = "";
    
    private int layer = 0;
    private String name, type, src, width, height, id;
    private boolean done = false;
    
    public void startElement(String namespaceURI, String sName,  String qName, Attributes attrs)    throws SAXException
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
                
                retData += ".sp"+id+"{ z-index: "+ layer +"; position: absolute; width: "+width+"px; height: "+height+"px; background-image: url('"+src+"'); }\n";
            }           
        }
    }
    
    public void endElement(String namespaceURI, String sName,  String qName)    throws SAXException
    {
        String eName;
        
        if((eName = sName).equals(""))
            eName = qName;
        
        if(eName.equals("mapsprites"))
            done = true;
    }
    
    
    public String toString(){   return retData;   }
}
