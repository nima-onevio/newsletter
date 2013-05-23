class HomeController < ApplicationController
  def index
    @body_class = "main_body"
  end

  def thanks
    @body_class = "thanks_body"
  end

  def subscribe
    gb     = Gibbon.new
    @email = params[:EMAIL]
    @lists = gb.lists({:start => 0, :limit=> 100})

    respond_to do |format|
      if valid_email? @email

        #does this email exists in our list already?
        #success = gb.listSubscribe({:id => '82f2bd1a58', :email_address => @email})
        user_info = gb.listMemberInfo({:id => '82f2bd1a58',  :email_address => @email})

        if user_info["success"] == 1
          format.json { render :json => { email: @email, status: 0, message: "you are already subscribed"} }
        else
          # gb.listSubscribe({:id => '82f2bd1a58', :email_address => @email})
          format.json { render :json => { email: @email, status: 1, message: user_info } }
        end

      else
        format.json { render :json => { email: @email, status: 0, message: "invalid email" } }
      end
    end
  end

  private
  #method will validate a given email address
  def valid_email?(email)
    valid_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    (email.present? && email =~ valid_regex)
  end
end