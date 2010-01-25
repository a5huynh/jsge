/*
 *  game.java - game Class
 *
 *  Created on December 7, 2006, 10:49 AM
 */

package cseGame;

import java.io.*;
import java.net.*;

import javax.servlet.*;
import javax.servlet.http.*;

import javax.xml.parsers.SAXParserFactory;
import javax.xml.parsers.SAXParser;

/**
 *
 *  @author Andrew
 *  @version
 */
public class game extends HttpServlet
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
        
        String action = request.getParameter("action");
        
        if(action != null)
            loadData(Integer.parseInt(action), "sprites.xml");
        
        out.close();
    }
    
    private void loadData(int action, String file)
    {
        MapHandler mHandler = new MapHandler(action);
        SAXParserFactory factory = SAXParserFactory.newInstance();
        try 
        {                   
            // Parse the input
            InputStream istream = new FileInputStream(getServletContext().getRealPath("GameData" + File.separator + file));
            SAXParser saxParser = factory.newSAXParser();
            saxParser.parse(istream, mHandler);

        } catch (Throwable t){  out.println(t.toString());    }
        
        
        out.println(mHandler.toString());        
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
