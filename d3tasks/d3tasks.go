package d3tasks

import (
	"os"
	//"bytes"
	"fmt"
	"http"
	"json"
	"template"
)

import (
	"appengine"
	"appengine/user"
	"appengine/datastore"
)

type Tasks struct {
	UserId string
}

var (
	indexTemplate = template.MustParseFile("index.html", nil)
	errorTemplate *template.Template // setup in init()
)

// App Engine owns main and start the HTTP Service,
// we do our setup during initialization
func init() {

	// Binding Handler Funcs
	http.HandleFunc("/", errorHandler(indexHandler))
	http.HandleFunc("/tasks", errorHandler(taskHandler))

	// initialize Templates
	errorTemplate = template.New(nil)
	errorTemplate.SetDelims("{{{", "}}}")
	if err := errorTemplate.ParseFile("error.html"); err != nil {
		errorTemplate = nil
	}

}


func indexHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != "GET" {
		return
	}

	indexTemplate.Execute(w, nil)

	return

}

func taskHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != "GET" {
		return
	}

	c := appengine.NewContext(r)
	u := user.Current(c)

	_ = u.String()

	q := datastore.NewQuery("Tasks")//.Filter("UserId = " + u.String()).Order("-Priority")

	var tasks []Tasks

	for t := q.Run(c); ; {

		var task Tasks
		_, err := t.Next(&task) // _ is Key value

		if err == datastore.Done {
			break
		}

		check(err)

		tasks = append(tasks, task)

	}

	bytes, err := json.Marshal(tasks)
	check(err)

	w.Header().Set("Content-Type", "application/json")
	w.Write(bytes)

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
		panic(err)
	}

}
