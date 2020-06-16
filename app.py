"""Flask app for Cupcakes"""
from flask import Flask, render_template, redirect, render_template, jsonify, request
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Cupcake

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgres:///cupcakes"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

app.config['SECRET_KEY'] = 'Secret'
debug = DebugToolbarExtension(app)

connect_db(app)


@app.route('/')
def new_cupcake_form():
    """
    returns home page containing a form to add to the
    """
    return render_template('home.html')


@app.route('/api/cupcakes')
def show_all_cupcakes():
    """
    Return all cupcakes in system.

    Returns JSON like:
        {cupcakes: [{id, flavor, rating, size, image}, ...]}
    """

    all_cupcakes = [cupcake.serialize() for cupcake in Cupcake.query.all()]
    return jsonify(cupcakes=all_cupcakes)


@app.route('/api/cupcakes/<int:cupcake_id>')
def show_one_cupcake(cupcake_id):
    """
    Return data on specific cupcake.

    Returns JSON like:
        {cupcake: [{id, flavor, rating, size, image}]}
    """

    returned_cupcake = Cupcake.query.get_or_404(cupcake_id)
    return jsonify(cupcake=returned_cupcake.serialize())


@app.route('/api/cupcakes', methods=['POST'])
def create_cupcake():
    """
    Add cupcake, and return data about new cupcake.

    Returns JSON like:
        {cupcake: [{id, flavor, rating, size, image}]}
    """
    flavor = request.json['flavor']
    size = request.json['size']
    rating = request.json['rating']
    image = request.json.get('image', None)

    new_cupcake = Cupcake(flavor=flavor, size=size, rating=rating, image=image)

    db.session.add(new_cupcake)
    db.session.commit()

    response_json = jsonify(cupcake=new_cupcake.serialize())
    return (response_json, 201)


@app.route('/api/cupcakes/<int:cupcake_id>', methods=['PATCH'])
def update_cupcake(cupcake_id):
    """
    Update cupcake from data in request. Return updated data.

    Returns JSON like:
        {cupcake: [{id, flavor, rating, size, image}]}
    """
    cupcake = Cupcake.query.get_or_404(cupcake_id)

    cupcake.flavor = request.json.get('flavor', cupcake.flavor)
    cupcake.size = request.json.get('size', cupcake.size)
    cupcake.rating = request.json.get('rating', cupcake.rating)
    cupcake.image = request.json.get('image', cupcake.image)

    db.session.add(cupcake)
    db.session.commit()

    return jsonify(cupcake=cupcake.serialize())


@app.route('/api/cupcakes/<int:cupcake_id>', methods=['DELETE'])
def delete_cupcake(cupcake_id):
    """Delete cupcake and return confirmation message.

    Returns JSON of {message: "Deleted"}
    """
    found_cupcake = Cupcake.query.get_or_404(cupcake_id)
    db.session.delete(found_cupcake)
    db.session.commit()

    return jsonify(message="Deleted")
