A. Step to run the project:
	1. Deploy database: cd to server folder, run command: node dbsetup.js 
		If there is no error, you should be able to see: "Database deployment completed" in the console
	2. Start API node server: in server folder, run another command: node server.js
		The server should be up and run on port 3001
	3. Start client : cd to client folder, run command : grunt serve
		You should be able to see the web at localhost:9000


B. Rest API endpoints:
	1. API to get all the distinct years. This API is used to generate options for the Select element in the UI
	Url : /years
	Method: GET
	Sample call: localhost:3001/years
	Sample response: [2012,2013]
	Error response: "Error getting data"

	2. API to get revenue data
	Url: /sales
	URL Params: 
    Optional: year=[integer]
	Method: GET
	Sample calls : localhost:3001/sales
  	          	   localhost:3001/sales?year=2012

C. Main technologies used:
	1. Backend: Node, Mongodb ...
		Note: 
		I use http to access to provided link (http://aware­ui­test1.s3.amazonaws.com/sample_data.json.txt.gz), download the file, unzip, convert to Json and save to a remote Mongodatabase. This part is done in dbsetup.js
		Everytime we run the file, it will drop the existing database, download the file and create another database to test. This provides the ability to test different dataset. To do so, you can just upload another file with the same name on http://aware­ui­test1.s3.amazonaws.com, rerun node dbsetup.js, a new database will be ready to test.

	2. Frontend: AngularJs, Bootstrap ...
		I use Bootstrap to create responsive UI.

