package d3tasks

import (
	"os"
	"fmt"
	"http"
	"template"
	"log"
)

//var (
//	errorTemplate *template.Template
//)


// errorHandler wraps the argument handler with an error-catcher that
// returns a 500 HTTP error if the request fails (calls check with err non-nil)
func ErrorHandler(fn http.HandlerFunc, tmpl *template.Template) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		errorTemplate = tmpl

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
