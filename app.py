from flask import Flask, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask import request
app = Flask(__name__)
CORS(app)

app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = "123456"
app.config["MYSQL_DB"] = "login"
app.config["MYSQL_HOST"] = "localhost"
mysql = MySQL(app)

@app.route('/api/login', methods=['GET'])
def login():
    if request.method == 'GET':
            cursor = mysql.connection.cursor()
            sql_string = "SELECT username, password FROM users"
            cursor.execute(sql_string)
            result = cursor.fetchall()
            data = [{'username': row[0], 'password': row[1]} for row in result]
            cursor.close()
            return jsonify(data)
    else:
        return jsonify

@app.route('/')
def home():
    return "Welcome to the API!"

if __name__ == '__main__':
    app.run(port=5003)