class HomeController < ApplicationController
  def index
    @body_class = "main_body"
  end
  def thanks
    @body_class = "thanks_body"
  end
  def subscribe
    #debugger
    @email = params[:EMAIL]
    #gb = Gibbon.new("5cbd155a5c95c2741a96cc57ce5d612d-us7")

    respond_to do |format|
      format.js  { render :text => @email}
      format.json { render :json => { :email => "got your email" } }
    end
  end
end
