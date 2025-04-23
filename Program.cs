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
          else if (request.Path == "addSong")
          {
            var (name, singer, imageUrl, audioUrl, userId) = request.GetBody<(string, string, string, string, string)>();

            database.Songs.Add(new Song(0, name, singer, imageUrl, audioUrl, userId));
            response.Send("Song added successfully");
          }
          else if (request.Path == "getSongs")
          {
            var userId = request.GetBody<string>();
            var songs = database.Songs
                .Where(song => song.UserId == userId)
                .ToList();

            response.Send(songs);
          }
          response.SetStatusCode(405);

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
}


class User(string id, string username, string password)
{
  [Key] public string Id { get; set; } = id;
  public string Username { get; set; } = username;
  public string Password { get; set; } = password;
}





class Song(int id, string name, string singer, string imageUrl, string audioUrl, string userId)
{
  [Key] public int Id { get; set; } = id;
  public string Name { get; set; } = name;
  public string Singer { get; set; } = singer;
  public string ImageUrl { get; set; } = imageUrl;
  public string AudioUrl { get; set; } = audioUrl;
  public string UserId { get; set; } = userId;
}

