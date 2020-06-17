from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, SelectField
from wtforms.validators import InputRequired, Optional, URL, NumberRange


class CupcakeForm(FlaskForm):
    """form call for a cupcake"""

    flavor = StringField("Cupcake Flavor", validators=[
                         InputRequired("flavor can't be bank")])
    size = SelectField("Cupcake Size", choices=[('Small', "Small"), ('Medium', "Medium"), (
        'Large', "Large")], validators=[InputRequired(message="Size can't be blank")])
    rating = FloatField("Rating out of 10", validators=[
        InputRequired(message="a rating is required"), NumberRange(min=0, max=10, message="Rating must be between 0 & 10")])
    image = StringField("Cupcake Image Photo URL", validators=[Optional(), URL(
        require_tld=True, message="input must be a URL")])


class EditCupcakeForm(FlaskForm):
    """form call for a cupcake"""

    editFlavor = StringField("Cupcake Flavor", validators=[
        InputRequired("flavor can't be bank")])
    editSize = SelectField("Cupcake Size", choices=[('Small', "Small"), ('Medium', "Medium"), (
        'Large', "Large")], validators=[InputRequired(message="Size can't be blank")])
    editRating = FloatField("Rating out of 10", validators=[
        InputRequired(message="a rating is required"), NumberRange(min=0, max=10, message="Rating must be between 0 & 10")])
    editImage = StringField("Cupcake Image Photo URL", validators=[Optional(), URL(
        require_tld=True, message="input must be a URL")])
