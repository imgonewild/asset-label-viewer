
from flask import Flask, json, request, jsonify
from flask_cors import CORS, cross_origin
import csv, os
import mysql.connector
import socket
from flask import send_file

app = Flask(__name__)
app.json.sort_keys = False
cors = CORS(app)

# MySQL database configuration
db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': '',
    'database': 'test'}

@app.route('/WPJK IT Data example.csv')
def download_csv():
    try:
        return send_file(
            os.path.join(os.path.dirname(__file__), 'WPJK IT Data example.csv'),
            as_attachment=True
        )
    except Exception as e:
        return str(e), 404
    
@cross_origin()
@app.route('/fetchLabel', methods=['POST'])
def index():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        payload = request.get_json(force=True)
        cursor.execute(
            "SELECT *FROM wpjk WHERE label = %s", (
                payload['label'],)
        )

        data = cursor.fetchall()

        result = [dict(zip(cursor.column_names, row)) for row in data]
        cursor.close()
        conn.close()

        return jsonify(result)

    except Exception as e:
        return str(e)

@cross_origin()
@app.route('/upload', methods=['POST'])
def upload():
    f = request.files['file']
    fstring = f.read().decode("utf8")
    csv_dicts = [{k: v for k, v in row.items()} for row in
                 csv.DictReader(fstring.splitlines(), skipinitialspace=True)]
    # print("csv_dicts",csv_dicts)

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        for data in csv_dicts:
            # Extract values from the dictionary
            values = [data.get(column) for column in data]
            double_values = values *2
            query = "INSERT INTO wpjk (plant,label,user,location,ip_address,ip_type,mac,host_name,brand,model,service_id_or_serial_number,cpu,ram,storage,os_type,os_product_key,admin_account,password,office_version,office_product_key,old_office_version,old_office_product_key,antivirus,as400) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) ON DUPLICATE KEY UPDATE plant = %s,label = %s,user = %s,location = %s,ip_address = %s,ip_type = %s,mac = %s,host_name = %s,brand = %s,model = %s,service_id_or_serial_number = %s,cpu = %s,ram = %s,storage = %s,os_type = %s,os_product_key = %s,admin_account = %s,password = %s,office_version = %s,office_product_key = %s,old_office_version = %s,old_office_product_key = %s,antivirus = %s,as400 = %s"
            cursor.execute(query, double_values)
       
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "OK"})

    except Exception as e:
        return jsonify(str(e))


if __name__ == '__main__': #WP-DV-23101
    # Uncomment the certificate and key lines
    context = ('./certs-old/localhost+3.pem', './certs-old/localhost+3-key.pem')  # certificate and key files
    # context = ('./certs/key.pem', './certs/cert.pem') 
    # Run the server with HTTPS enabled
    app.run(host='0.0.0.0', port=3000, ssl_context=context)
