package d3tasks

// import golang liblary
import (
	"os"
	"fmt"
	"http"
	"json"
	"template"
	"log"
	"strconv"
)

// import appengine
import (
	"appengine"
	"appengine/user"
	"appengine/datastore"
)

// template Valiables
var (
	indexTemplate *template.Template // = template.MustParseFile("main.html", nil)
	errorTemplate *template.Template // setup in init()
)

// App Engine owns main and start the HTTP Service,
// we do our setup during initialization
func init() {

	var err os.Error

	// Binding Handler Funcs
	http.HandleFunc("/", errorHandler(indexHandler))
	http.HandleFunc("/tasks", errorHandler(taskHandler))
	http.HandleFunc("/post", errorHandler(postHandler))

	// initialize Templates
	indexTemplate = template.New(nil)
	indexTemplate.SetDelims("{{", "}}")
	err = indexTemplate.ParseFile("main.html")
	check(err)

	errorTemplate = template.New(nil)
	errorTemplate.SetDelims("{{{", "}}}")
	err = errorTemplate.ParseFile("error.html")
	check(err)
}


// main page handler
func indexHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != "GET" {
		return
	}

	indexTemplate.Execute(w, nil)

	return

}

// Response Tasks Json Handler 
func taskHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != "GET" {
		return
	}

	c := appengine.NewContext(r)
	u := user.Current(c)

	log.Println("before Query")
	q := datastore.NewQuery("Tasks").Filter("UserId = ", u.String()) //.Order("-Priority")

	log.Println("after")

	var tasks []Tasks

	for t := q.Run(c); ; {

		var task Tasks
		key, err := t.Next(&task)

		log.Println(err)

		if err == datastore.Done {
			break
		}

		check(err)
		log.Println("keys:" + strconv.Itoa64(key.IntID()))
		task.KeyID = key.IntID()
		tasks = append(tasks, task)

	}

	bytes, err := json.Marshal(tasks)
	check(err)

	w.Header().Set("Content-Type", "application/json")

	w.Write(bytes)

}

func postHandler(w http.ResponseWriter, r *http.Request) {

	var err os.Error
	var ok bool

	c := appengine.NewContext(r)

	printLog(c, "Post Handler Start")

	if r.Method != "POST" {
		printLog(c, "Not Post Method Return")
		return
	}

	err = r.ParseForm()
	check(err)

	printLog(c, "form parsed")
	u := user.Current(c)

	printLog(c, "User:"+u.String())

	task := new(Tasks)
	err = task.SetValue(u.String(), r)

	printLog(c, "Set Values")

	check(err)

	if err, ok = task.IsValid(); ok {
		check(err)
		// postエラーの場合にjQueryでステータスを取れるか？
	}

	printLog(c, "Validated")

	if task.KeyID != 0 {
		k := datastore.NewKey("Tasks", "", task.KeyID, nil)
		_, err = datastore.Put(c, k, task)
	} else {
		_, err = datastore.Put(c, datastore.NewIncompleteKey("Tasks"), task)
	}

	log.Println(err)
	check(err)

	printLog(c, "Puted")

	return

}


// errorHandler wraps the argument handler with an error-catcher that
// returns a 500 HTTP error if the request fails (calls check with err non-nil)
func errorHandler(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		defer func() {
			if err, ok := recover().(os.Error); ok {
				w.WriteHeader(http.StatusInternalServerError)
				if errorTemplate != nil {
					errorTemplate.Execute(w, err)
				} else {
					fmt.Sprintf("%v", err)
				}
			}
		}()

		// invoke Handler Func
		fn(w, r)

	}
}

func check(err os.Error) {
	if err != nil {
		log.Println(err)
		panic(err)
	}

}

func printLog(c appengine.Context, v string) {

	if appengine.IsDevAppServer() {
		log.Println(v)
	} else {
		c.Logf("%v", v)
	}

}
