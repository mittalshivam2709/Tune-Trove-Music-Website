from flask import Flask, render_template,redirect,url_for,jsonify,request
import sqlite3
from flask_cors import CORS
app = Flask(__name__)
CORS(app, orgins="*")


conn = sqlite3.connect('playlist.db')
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS songs
             (sr_num INTEGER PRIMARY KEY,
             name TEXT,
             date_added TEXT,
             duration REAL)''')

conn.commit()
conn.close()


@app.route('/add_song_to_playlist', methods=['POST'])

def add_song_to_playlist():
    # data is received in JSON format and stored in the variable data
    data = request.json 

    name = data['name']
    date = data['date']
    duration = data['duration']
    conn = sqlite3.connect('playlist.db')
    c = conn.cursor()
    c.execute("SELECT * FROM songs WHERE name = ? AND date_added = ? AND duration = ?",
              (name, date, duration))
    result = c.fetchone()

    if result:
        # Data is already present in the database, so skip insertion
        conn.close()
        return jsonify({'success': False, 'message': 'Data already exists'})

    conn = sqlite3.connect('playlist.db')
    c = conn.cursor()
    c.execute("INSERT INTO songs ( name, date_added, duration) VALUES (?, ?, ?)",
              (name, date, duration))
    conn.commit()
    conn.close()

    return jsonify({'success': True})


@app.route('/')
def home():
  return render_template('webpage.html')

@app.route('/playlist')
def index():
    conn = sqlite3.connect('playlist.db')
    c = conn.cursor()
    c.execute('SELECT * FROM songs')
    data = c.fetchall()
    conn.close()
    return render_template('songs.html', data=data)

@app.route('/remove_song/<int:sr_num>', methods=['POST'])
def remove_song(sr_num):
    try:    
        conn = sqlite3.connect('playlist.db')
        c = conn.cursor()
        c.execute('DELETE FROM songs WHERE sr_num = ?', (sr_num,))
        conn.commit()
        conn.close()
        return redirect(url_for('index'))
    except Exception as e:
        return "An error occurred: " + str(e)

if __name__ == '__main__':
    app.run(debug=True)

