package d3tasks

import (
	"appengine/datastore"
	"os"
	"html"
	"time"
	"http"
	"strconv"
	"log"
)

// structure for datastore
type Tasks struct {
	UserId       string         // User Mail Address
	Status       int            // Task Status
	Context      string         // Task Detail
	IsComplete   bool           // is Completed
	IsCanceld    bool           // is Deleted
	IsUseLimit   bool           // Use TimeLimit
	PlanDate     datastore.Time // Task Time Limit
	PostDate     datastore.Time // new Post Date
	CompleteDate datastore.Time // Complete Date
	KeyString    string         // this key is Tempplaly valiale
}

const (
	FORM_KEY     = "task_key"
	FORM_STATUS  = "status"
	FORM_CONTEXT = "context"
	FORM_LIMIT   = "use_limit"
	FORM_DATE    = "limit_date"
)


// Set Value From HTMLForm Values
func (t *Tasks) SetValue(Id string, r *http.Request) os.Error {

	var err os.Error

	t.UserId = Id
	t.KeyString = r.FormValue(FORM_KEY)
	t.Status, err = strconv.Atoi(r.FormValue(FORM_STATUS))
	if err != nil {
		log.Println(err)
		return err
	}

	log.Println("Status")

	t.Context = html.EscapeString(r.FormValue(FORM_CONTEXT))
	t.IsUseLimit, err = strconv.Atob(r.FormValue(FORM_LIMIT))
	if err != nil {
		log.Println(err)
		return err
	}

	log.Println("IsUseLimit")

	t.IsComplete = (t.Status == 2)
	t.IsCanceld = (t.Status == 9)

	log.Println("Set Bool Value")

	if t.IsUseLimit {

		log.Println(r.FormValue(FORM_DATE))
		log.Println(time.RFC3339)
		var limit *time.Time
		limit, err = time.Parse("2006-01-02 15:04:05", r.FormValue(FORM_DATE))
		if err == nil {
			t.PlanDate = datastore.SecondsToTime(limit.Seconds())
		} else {
			log.Println(err)
			return err
		}
	}

	log.Println("PostDate")
	t.PostDate = datastore.SecondsToTime(time.Seconds())
	if t.IsComplete {
		t.CompleteDate = datastore.SecondsToTime(time.Seconds())
	}

	return nil

}


// Validating Tasks Model Values 
func (t *Tasks) IsValid() (os.Error, bool) {

	if t.UserId == "" {
		return os.NewError(""), false
	}

	if t.Status < 0 || t.Status > 2 {
		return os.NewError(""), false
	}

	if t.Context == "" {

		return os.NewError(""), false
	}

	t.Context = html.EscapeString(t.Context)

	return nil, true

}
