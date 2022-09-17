from flask import request, jsonify

def testFunction():
    a = "success"
    return a

def test1():
    if request.form.get('registration') == 'success':
        return jsonify({'abc': 'successfuly registered'})

    return jsonify({'abc': 'registration unsuccessful'})

