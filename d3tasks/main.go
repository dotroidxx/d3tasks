package d3tasks

// import golang liblary
import (
	"os"
	//	"fmt"
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
	http.HandleFunc("/", ErrorHandler(indexHandler, nil))
	http.HandleFunc("/tasks", ErrorHandler(getAllHandler, nil))
	http.HandleFunc("/onetask", ErrorHandler(getOneHandler, nil))
	http.HandleFunc("/update", ErrorHandler(updateHandler, nil))
	http.HandleFunc("/create", ErrorHandler(createHandler, nil))

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
func getOneHandler(w http.ResponseWriter, r *http.Request) {

	var err os.Error

	if r.Method != "GET" {
		return
	}

	c := appengine.NewContext(r)

	err = r.ParseForm()
	check(err)
	var id int64
	id, err = strconv.Atoi64(r.FormValue("id"))
	k := datastore.NewKey("Tasks", "", id, nil)

	var task *Tasks
	err = datastore.Get(c, k, task)
	check(err)

	returnJson(w, task)

}

// Response Tasks Json Handler 
func getAllHandler(w http.ResponseWriter, r *http.Request) {

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

	returnJson(w, tasks)

}

func returnJson(w http.ResponseWriter, v interface{}) {
	bytes, err := json.Marshal(v)
	check(err)
	w.Header().Set("Content-Type", "application/json")
	w.Write(bytes)
}

func updateHandler(w http.ResponseWriter, r *http.Request) {

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

	returnJson(w, task.KeyID)

}

func createHandler(w http.ResponseWriter, r *http.Request) {

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

	u := user.Current(c)

	task := new(Tasks)

	task.Context = r.FormValue("context")
	task.Status = 0
	task.UserId = u.String()

	if err, ok = task.IsValid(); ok {
		check(err)
		// postエラーの場合にjQueryでステータスを取れるか？
	}

	printLog(c, "Validated")

	var resultKey *datastore.Key
	resultKey, err = datastore.Put(c, datastore.NewIncompleteKey("Tasks"), task)

	log.Println(err)
	check(err)

	printLog(c, "Puted")

	returnJson(w, resultKey.IntID())

}


func printLog(c appengine.Context, v string) {

	if appengine.IsDevAppServer() {
		log.Println(v)
	} else {
		c.Logf("%v", v)
	}

}
