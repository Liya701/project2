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
    // מוסיף שירים ברירת מחדל אם עדיין לא קיימים כאלה בבסיס הנתונים
    if (!database.Songs.Any(song => song.UserId == "default")) // Any בודק האם קיים לפחות שיר אחד שמשתמש ברירת המחדל יצר
    {
      database.Songs.Add(new Song( // מוסיף שיר חדש לטבלה
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

           if (File.Exists(request.Path)) // אם מבקשים קובץ אמיתי במערכת
      {
        var file = new File(request.Path);
        response.Send(file); // שולח את הקובץ חזרה ללקוח
      }
      else if (request.ExpectsHtml()) // אם הלקוח מצפה ל-HTML אבל הקובץ לא נמצא
      {
        var file = new File("website/pages/404.html");
        response.SetStatusCode(404);
        response.Send(file); // שולח עמוד שגיאה 404
      }
      else
      {

        try
        {
          if (request.Path == "signup") // הרשמה
          {
            var (username, password) = request.GetBody<(string, string)>(); // שולף שם משתמש וסיסמה מהבקשה (tuple)
                 var userExists = database.Users.Any(user => user.Username == username); // בודק אם כבר קיים משתמש עם שם כזה


            if (!userExists) // אם המשתמש לא קיים - מוסיפים אותו
            {
              var userId = Guid.NewGuid().ToString(); // יוצר מזהה ייחודי חדש למשתמש
              database.Users.Add(new User(userId, username, password)); // מוסיף את המשתמש לטבלה
              response.Send(userId); // שולח ללקוח את ה-ID
            }
          }
          else if (request.Path == "login") // התחברות
          {
            var (username, password) = request.GetBody<(string, string)>(); // שולף שם משתמש וסיסמה
            var user = database.Users.FirstOrDefault( // מחפש משתמש שתואם גם בשם וגם בסיסמה
              user => user.Username == username && user.Password == password);

            if (user == null) // אם לא נמצא משתמש תואם - מחזירים null
              response.Send<string?>(null);
            else
              response.Send(user.Id); // אחרת שולחים את ה-ID שלו
          }
          else if (request.Path == "getUsername") // בקשת שם משתמש לפי ID
          {
            var userId = request.GetBody<string>(); // שולף מזהה מהבקשה
            var user = database.Users.Find(userId)!; // Find מחפש לפי מפתח ראשי
            response.Send(user.Username); // שולח את שם המשתמש
          }
          else if (request.Path == "addSong") // הוספת שיר
          {
            var (name, singer, imageUrl, audioUrl, userId) = request.GetBody<(string, string, string, string, string)>(); // שולף פרטי שיר
            database.Songs.Add(new Song(name, singer, imageUrl, audioUrl, userId)); // מוסיף את השיר לטבלה
            response.Send("Song added successfully"); // מחזיר אישור
          }
          else if (request.Path == "getSong") // שליפת שירים לפי משתמש
          {
            var userId = request.GetBody<string>(); // שולף userId

            var songs = database.Songs
              .Where(song => song.UserId == userId) // מסנן לפי משתמש
              .Select(song => new // בונה אובייקט אנונימי רק עם השדות שרוצים להחזיר
              {
                name = song.Name,
                singer = song.Singer,
                imageUrl = song.ImageUrl,
                audioUrl = song.AudioUrl,
              })
              .ToList(); // ממיר לרשימה

            response.Send(songs); // מחזיר את השירים
          }
          else if (request.Path == "getPreviews") // שליפת שירים רגילים וגם ברירת מחדל
          {
            var userId = request.GetBody<string>(); // שולף userId

            var previews = database.Songs
              .Where(song => song.UserId == userId || song.UserId == "default") // גם שירים של המשתמש וגם ברירת מחדל
              .Select(song => new
              {
                id = song.Id,
                name = song.Name,
                singer = song.Singer,
                imageUrl = song.ImageUrl,
                audioUrl = song.AudioUrl,
              })
              .ToList();

            response.Send(previews); // שולח את השירים
          }
          else if (request.Path == "getIsFavorite") // בדיקה האם שיר נמצא במועדפים
{
         (var userId, var songId) = request.GetBody<(string, int)>(); // שולף ומפרק את המשתנים

          if (string.IsNullOrEmpty(userId)) // אם ה-userId חסר
           {
          response.SetStatusCode(400);
          response.Send("Missing user ID");
              return;
             }

             bool isFavorite = database.Favorites.Any( // בודק אם יש רשומה בטבלת המועדפים שתואמת לשני הערכים
              f => f.UserId == userId && f.SongId == songId);

              response.Send(isFavorite); // שולח true/false
              }
          else if (request.Path == "addToFavorites") // הוספה למועדפים
          {
            var (userId, songId) = request.GetBody<(string, int)>(); // שולף מזהים
            Favorite userFavorite = new Favorite(userId, songId); // יוצר אובייקט חדש
            database.Favorites.Add(userFavorite); // מוסיף אותו לטבלה
          }
          else if (request.Path == "removeFromFavorites") // הסרה ממועדפים
          {
            var (userId, songId) = request.GetBody<(string, int)>(); // שולף מזהים

            Favorite favorite = database.Favorites.First( // מחפש את המועדף המתאים בדיוק לפי המשתמש והשיר
              f => f.UserId == userId && f.SongId == songId);

            database.Favorites.Remove(favorite); // מסיר אותו מהטבלה
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

