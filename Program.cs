using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

class Program
{
  static void Main()
  {
    int port = 5000;

    var server = new Server(port);

    Console.WriteLine("The server is running");
    Console.WriteLine($"Main page: http://localhost:{port}/website/pages/signup.html");

    var database = new Database();
    if (true)
    {
      if (!database.Songs.Any(song => song.UserId == "default"))
      {
        database.Songs.Add(new Song(
          "Bohemian Rhapsody",
          "Queen",
          "https://did.li/Dq4TY",
        "https://youtu.be/fJ9rUzIMcZQ?si=MfFfNN0FDRKlkB7l",
        "default"

        ));
        database.Songs.Add(new Song(
         "God's Plan",
         "Drake",
         "https://did.li/LiSrl",
       "https://youtu.be/xpVfcZ0ZcFM?si=aV4webhE8nuWHJyh",
       "default"

       ));
           database.Songs.Add(new Song(
          "I Love It",
          "Icona Pop & Charli XCX ",
          "https://did.li/QZXaa",
        "https://youtu.be/G83t6zH9Axk?si=vSnVEdwkFd8m1fpo",
        "default"

        ));
      }
    }

    while (true)
    {
      (var request, var response) = server.WaitForRequest();

      Console.WriteLine($"Recieved a request with the path: {request.Path}");

      if (File.Exists(request.Path))
      {
        var file = new File(request.Path);
        response.Send(file);
      }
      else if (request.ExpectsHtml())
      {
        var file = new File("website/pages/404.html");
        response.SetStatusCode(404);
        response.Send(file);
      }
      else
      {

        try
        {

          if (request.Path == "signup")
          {
            var (username, password) = request.GetBody<(string, string)>();

            var userExists = database.Users.Any(user =>
              user.Username == username
            );

            if (!userExists)
            {
              var userId = Guid.NewGuid().ToString();
              database.Users.Add(new User(userId, username, password));
              response.Send(userId);
            }
          }
          else if (request.Path == "login")
          {
            var (username, password) = request.GetBody<(string, string)>();

            var user = database.Users.First(
              user => user.Username == username && user.Password == password
            );

            var userId = user.Id;

            response.Send(userId);
          }
          else if (request.Path == "getUsername")
          {
            var userId = request.GetBody<string>();

            var user = database.Users.Find(userId)!;

            response.Send(user.Username);
          }
          else if (request.Path == "addSong")
          {
            var (name, singer, imageUrl, audioUrl, userId) = request.GetBody<(string, string, string, string, string)>();

            database.Songs.Add(new Song(name, singer, imageUrl, audioUrl, userId));
            response.Send("Song added successfully");
          }
          else if (request.Path == "getSong")
          {
            var userId = request.GetBody<string>();

            var songs = database.Songs
              .Where(song => song.UserId == userId)
              .Select(song => new
              {
                name = song.Name,
                singer = song.Singer,
                imageUrl = song.ImageUrl,
                audioUrl = song.AudioUrl,
              })
              .ToList();

            response.Send(songs);
          }

          else if (request.Path == "getPreviews")
          {
            var UserId = request.GetBody<string>();

            var previews = database.Songs
              .Where(song => song.UserId == UserId || song.UserId == "default")
              .Select(song => new
              {
                id = song.Id,
                name = song.Name,
                singer = song.Singer,
                imageUrl = song.ImageUrl,
                audioUrl = song.AudioUrl,
              })
              .ToList();

            response.Send(previews);
          }
          else if (request.Path == "getIsFavorite")
          {
            (string userId, int songId) = request.GetBody<(string, int)>();

            bool isFavorite = database.Favorites.Any(
              f => f.UserId == userId && f.SongId == songId
            );

            response.Send(isFavorite);
          }
          else if (request.Path == "addToFavorites")
          {
            var (userId, songId) = request.GetBody<(string, int)>();
            Console.WriteLine(userId + ", " + songId);
            Favorite userFavorite = new Favorite(userId, songId);

            database.Favorites.Add(userFavorite);
          }
          else if (request.Path == "removeFromFavorites")
          {
            var (userId, songId) = request.GetBody<(string, int)>();

            Favorite favorite = database.Favorites.First(
              f => f.UserId == userId && f.SongId == songId
            );

            database.Favorites.Remove(favorite);

          }
          else
          {
            response.SetStatusCode(405);
          }

          database.SaveChanges();
        }
        catch (Exception exception)
        {
          Log.WriteException(exception);
        }
      }

      response.Close();
    }
  }
}


class Database() : DbBase("database")
{
  public DbSet<User> Users { get; set; } = default!;
  public DbSet<Song> Songs { get; set; } = default!;
  public DbSet<Favorite> Favorites { get; set; } = default!;

}


class User(string id, string username, string password)
{
  [Key] public string Id { get; set; } = id;
  public string Username { get; set; } = username;
  public string Password { get; set; } = password;
}





class Song(string name, string singer, string imageUrl, string audioUrl, string userId)
{
  [Key] public int Id { get; set; } = default!;
  public string Name { get; set; } = name;
  public string Singer { get; set; } = singer;
  public string ImageUrl { get; set; } = imageUrl;
  public string AudioUrl { get; set; } = audioUrl;
  public string UserId { get; set; } = userId;
}

class Favorite(string userId, int songId)
{
  [Key]
  public int Id { get; set; }

  public string UserId { get; set; } = userId;
  public int SongId { get; set; } = songId;

  [ForeignKey("UserId")]
  public User? User { get; set; }

  [ForeignKey("SongId")]
  public Song? song { get; set; }
}

