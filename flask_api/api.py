from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort
from authentication import sp
from spotify import current_song, get_current_album_cover, top_20_tracks, top_20_artists, user_details, previously_listened
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
api = Api(app)  # Initialize Flask-RESTful API
CORS(app)  # Enable CORS for all routes


class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return f"User(name = {self.name}, email = {self.name})"


user_args = reqparse.RequestParser()
user_args.add_argument('name', type=str, required=True, help='Cannot be blank')
user_args.add_argument('email', type=str, required=True, help='Email cannot be blank')

userFields = {
    "id": fields.Integer,
    "name": fields.String,
    "email": fields.String,
}


class Users(Resource):
    @marshal_with(userFields)  # Use marshal_with to format the output
    def get(self):
        users = UserModel.query.all()
        return users

    @marshal_with(userFields)
    def post(self):
        args = user_args.parse_args()

        if UserModel.query.filter_by(name=args['name']).first():
            abort(409, message="User already exists")

        user = UserModel(name=args['name'], email=args['email'])
        db.session.add(user)
        db.session.commit()
        return user, 201


class User(Resource):
    @marshal_with(userFields)
    def get(self, id):
        user = UserModel.query.filter_by(id=id).first()
        if not user:
            abort(404, message="User not found")
        return user

    @marshal_with(userFields)
    def patch(self, id):
        args = user_args.parse_args()
        user = UserModel.query.filter_by(id=id).first()
        if not user:
            abort(404, message="User not found")
        user.name = args['name']
        user.email = args['email']
        db.session.commit()
        return user

    @marshal_with(userFields)
    def delete(self, id):
        user = UserModel.query.filter_by(id=id).first()
        if not user:
            abort(404, message="User not found")
        db.session.delete(user)
        db.session.commit()
        users = UserModel.query.all()
        return users


# Current Song API
class CurrentSong(Resource):
    def get(self):
        song = current_song()
        if song:
            return {"current_song": song}, 200
        else:
            return {"current_song": "No song is currently playing"}, 200


# Top 20 Tracks API
class Top20Tracks(Resource):
    def get(self):
        # Get the time range from the query string, default to "short_term"
        time_range = request.args.get('range', 'short_term')

        topTracks, TopTracksAlbumLinks = top_20_tracks(time_range)

        if topTracks and TopTracksAlbumLinks:
            return {"top_tracks": topTracks, "top_tracks_album_links": TopTracksAlbumLinks}, 200
        else:
            return {"message": "No recent songs found"}, 404


class getCurrentAlbumCover(Resource):
    def get(self):
        album_cover = get_current_album_cover()
        if album_cover:
            return {"album_cover": album_cover}, 200
        else:
            return {"message": "No album cover found"}, 404


class Top20Artists(Resource):
    def get(self):
        time_range = request.args.get('range', 'short_term')

        topArtist, topArtistPopularity, topArtistFollowers, topArtistPfpLink = top_20_artists(time_range)

        if topArtist and topArtistPopularity and topArtistFollowers and topArtistPfpLink:
            return {
                "top_artists": topArtist,
                "top_artists_popularity": topArtistPopularity,
                "top_artists_followers": topArtistFollowers,
                "top_artists_pfp_link": topArtistPfpLink
            }, 200
        else:
            return {"message": "No recent songs found"}, 404


class UserDetails(Resource):
    def get(self):
        user = user_details()
        if user:
            return user, 200
        else:
            return {"message": "No user found"}, 404
        

class PreviouslyListened(Resource):
    def get(self):
        previous_songs = previously_listened()
        if previous_songs:
            return {"previous_songs": previous_songs}, 200
        else:
            return {"message": "No previously listened songs found"}, 404


api.add_resource(Users, '/api/users/')
api.add_resource(User, '/api/users/<int:id>')  # Add resource for single user
api.add_resource(CurrentSong, '/api/current_song/')
api.add_resource(Top20Tracks, '/api/top_tracks/')
api.add_resource(getCurrentAlbumCover, '/api/album_cover/')
api.add_resource(Top20Artists, '/api/top_artists/')
api.add_resource(UserDetails, '/api/user_details/')
api.add_resource(PreviouslyListened, '/api/previously_listened/')


@app.route('/')
def home():
    return '<h1>Flask REST API</h1>'


if __name__ == '__main__':
    app.run(debug=True)
