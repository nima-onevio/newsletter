class HomeController < ApplicationController
  require 'net/http'

  def index

    total_members = 0

    #Facebook
    uri = URI("https://graph.facebook.com/onevio")
    data = Net::HTTP.get(uri)
    facebook_followers = JSON.parse(data)['likes']

    #Twitter
    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = "7GjKEDMbD2Kb4Tc6EZwIw"
      config.consumer_secret     = "VUwOT7vKLr9OelxYrRXvhLGgEDWouPsmvyniEWhyhcE"
      config.access_token        = "1270878410-pwiwIBB8lDebcu13L8IS5fiTbqBH7fl3pkLqLDe"
      config.access_token_secret = "Y7dpBkMgumQ8Hg0IcqlPTQlXmUr296ttpbJyuEc4oWGC9"
    end
    onevio = client.user('tweetonevio')
    twitter_followers = onevio.followers_count.to_i
    total_members = facebook_followers + twitter_followers


    ##Instagram
    #Instagram.configure do |config|
    #  config.client_id = "337f21670e0d42e2bfc5c53e05621f45"
    #  config.access_token = "f7c553798028404e8653e10182b39bb2"
    #end
    #
    #puts Instagram.media_popular.inspect
    #onevio = Instagram.user_search("onevio")
    #
    #puts "onevio: #{onevio.inspect}"

    @family_members = total_members.to_s

    @body_class = "main_body"
  end

  def works
    @body_class = "main_works"
  end

  def thanks
    @body_class = "thanks_body"
  end

  #this method will attempt to subscribe the user
  def subscribe
    gb = Gibbon::API.new
    @email = params[:EMAIL]
    @lists = gb.lists({start: 0, limit: 100})
    status = 1

    respond_to do |format|
      if valid_email? @email

        #does this email exists in our list already?
        user_info = gb.lists.memberInfo({id: '82f2bd1a58', emails: [{email: @email}]})
        resend_link = "<a class='resendMail' data-email='#{@email}' data-link='/revalidate' href='#'>Re-send validation E-mail</a>"

        if user_info["success_count"] == 1
          #pending user?
          user_status = user_info["data"][0]["status"]

          if user_status == "pending"
            status = 2
            message = "You've already signed up! Please check your email to confirm your subscription. #{resend_link}"
          else
            message = "You are already subscribed"
          end
        else
          # attempt to subscribe the user
          result = gb.lists.subscribe({id: '82f2bd1a58', email: @email})
          message = "Thanks! We've sent you an email!"
        end

      else
        status = 0
        message = "Invalid E-mail"
      end
      format.json { render json: {email: @email, status: status, message: message} }
    end
  end

  #this method will resend the validation email to a given address
  def revalidate
    @email = params[:email]

    respond_to do |format|
      if valid_email? @email
        gb = Gibbon::API.new
        result = gb.lists.subscribe({id: '82f2bd1a58', email: @email, double_optin: true})
        status = 1
        message = "Thanks! We've sent you an email!"
      else
        status = 0
        message = "Invalid E-mail"
      end
      format.json { render json: {email: @email, status: status, message: message} }
    end
  end

  private
  #method will validate a given email address
  def valid_email?(email)
    valid_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    (email.present? && email =~ valid_regex)
  end
end