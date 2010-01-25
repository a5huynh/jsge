/*
 *  chat.java - chat Class
 *
 *  Created on January 14, 2007, 9:10 AM
 */

package cseGame.chat;

import java.io.*;
import java.net.*;

import javax.servlet.*;
import javax.servlet.http.*;

import java.sql.*;


/**
 *
 *  @author Andrew
 *  @version
 *  @description Handles chatting between players. Stores chat message into database, according to 
 */
public class chat extends HttpServlet
{
    private PrintWriter out;
    
    /** Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     */
    protected void processRequest(boolean post, HttpServletRequest request, HttpServletResponse response) 
        throws ServletException, IOException {
        
        // Globalization.
        response.setContentType("text/html;charset=UTF-8");
        out = response.getWriter();

        Connection con = null;
        Statement statement = null;
        ResultSet result = null;

        try {
            // Get Database Driver
            Class.forName("org.hsqldb.jdbcDriver").newInstance();
            
            // Connect to Database
            con = DriverManager.getConnection("jdbc:hsqldb:hsql://localhost/chat", "chatApp", "chatApp");
            
            statement = con.createStatement();
                        
            // User sending/requesting messages.
            String user = request.getParameter("user");
            
            // Get current time.
            java.util.Date curTime = new java.util.Date();            
            
            // If using POST method, app is posting a message to the database.
            if(post) {
                // Retreive message and dest of message.
                String msg = request.getParameter("msg");
                
                // dest can be 'all', or a user name for private messaging.
                String dest = request.getParameter("dest");
                                            
                // Update database.
                statement.executeUpdate("INSERT INTO MSG (NAME, DEST, TIME, MSG) VALUES ('"+ user +"', '"+ dest+"', "+
                                curTime.getTime() + ", '"+ msg +"')");
            }
            // If using GET method, app is requesting messages from database.
            else {
               String time = request.getParameter("time");

                // Query the database for new messages after last update time.
                result = statement.executeQuery("SELECT * FROM MSG WHERE TIME > "+ time +" AND NAME <> '"+ user + "' AND"+
                                " (DEST = 'all' OR DEST = '"+ user +"')");
                
                out.print(curTime.getTime() + "\n");
                
                // Send back results, which are seperated by '\n'.
                while(result.next()) {
                    out.print(result.getString("NAME") + "\n");
                    out.print(result.getString("DEST") + "\n");
                    out.print(result.getLong("TIME") + "\n");
                    out.print(result.getString("MSG") + "\n");
                }
            }
        }
        catch (Exception e) {
            out.print("ERROR: failed to load HSQLDB JDBC driver.");
            e.printStackTrace();
            return;
        }        
        out.close();
    }
    
    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /** Handles the HTTP <code>GET</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(false, request, response);
    }
    
    /** Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(true, request, response);
    }
    
    /** Returns a short description of the servlet.
     */
    public String getServletInfo() {
        return "Handles AJAX chat back-end with database.";
    }
    // </editor-fold>
}
