/*
 *  objectQuery.java - objectQuery Class
 *
 *  Created on January 3, 2007, 12:27 PM
 */

package cseGame;

import java.io.*;
import java.net.*;

import javax.servlet.*;
import javax.servlet.http.*;

import java.sql.*;

/**
 *
 *  @author Andrew
 *  @version
 */
public class objectQuery extends HttpServlet
{
    private PrintWriter out;
    
    /** Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        response.setContentType("text/html;charset=UTF-8");
        out = response.getWriter();
        
        String id = request.getParameter("id");
        String type = request.getParameter("type").toLowerCase();
        
        String sqlId = "ID", dBase = "MAPOBJECT";
	
        if(type.equals("items")) {
            sqlId = "ITEMID";
            dBase = "ITEMS";
        }
        else if(type.equals("mapObj")) {
            dBase = "MAPOBJECT";
	}
	else if(type.equals("npc")) {
	    sqlId = "ID";
	    dBase = "NPCS";
	}
        
        Connection con = null;
        Statement statement = null;
        ResultSet result = null;

        try
        {
            // Get Database Driver
            Class.forName("org.hsqldb.jdbcDriver").newInstance();
            
            // Connect to Database
            con = DriverManager.getConnection("jdbc:hsqldb:hsql://localhost/xdb", "cseAdmin", "bobDole");

            statement = con.createStatement();

            result = statement.executeQuery("SELECT * FROM "+ dBase +" WHERE "+ sqlId +" = "+ id);

            while(result.next())
            {
                String data = "{'name': '" + result.getString("NAME") + "'";
                data += ", 'id': '" + id + "'";
                data += ", 'options': '" + result.getString("OPTIONS") + "'";
                data += ", 'script': '" + result.getString("SCRIPT").replaceAll("'", "%27") + "'";
                data += ", 'flags': '" + result.getString("FLAGS") + "'}";
                out.print(data);
            }
	    
	    con.close();
        }
        catch (Exception e)
        {
            out.print("ERROR: failed to load HSQLDB JDBC driver.");
	    out.print(e.toString());
            return;
        }    
	
        out.close();
    }
    
    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /** Handles the HTTP <code>GET</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException
    {
        processRequest(request, response);
    }
    
    /** Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException
    {
        processRequest(request, response);
    }
    
    /** Returns a short description of the servlet.
     */
    public String getServletInfo()
    {
        return "Short description";
    }
    // </editor-fold>
}
